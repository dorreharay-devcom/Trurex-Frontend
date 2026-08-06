import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Backend } from '~/shared/api/client';
import { useAuth } from '~/features/auth/providers';
import {
  addRexComment,
  deleteRexComment,
  getRexComments,
  likeRexComment,
  unlikeRexComment,
} from '~/features/rex-detail/api/rexCommentsApi';
import {
  insertOptimisticComment,
  removeCommentFromTree,
  totalRexCommentCount,
  updateCommentInTree,
} from '~/features/rex-detail/lib/rexCommentTree';
import { patchFeedCommentCount } from '~/features/rex-detail/lib/patchRecommendationCaches';
import type { RexComment } from '~/features/rex-detail/types/rexComment';
import { unknownErrorMessage } from '~/shared/lib/data/guards';
import { assertOnlineForMutation } from '~/shared/lib/network/assertOnline';
import { subscribeRealtimeWithResume } from '~/shared/lib/realtime/subscribeWithResume';

const REALTIME_SELF_ECHO_MS = 1_500;

function optimisticComment(params: {
  tempId: string;
  rexId: string;
  body: string;
  parentCommentId: string | null;
  authorId: string;
  displayName: string;
}): RexComment {
  const now = new Date().toISOString();
  return {
    id: params.tempId,
    rex_id: params.rexId,
    parent_comment_id: params.parentCommentId,
    author_id: params.authorId,
    body: params.body,
    created_at: now,
    updated_at: now,
    like_count: 0,
    liked_by_me: false,
    reply_count: 0,
    profile: {
      display_name: params.displayName,
      avatar_url: null,
      username: null,
      relationship_status: null,
    },
    replies: [],
  };
}

export function useRexComments(rexId: string | undefined) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [comments, setComments] = useState<RexComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const commentLikeInFlight = useRef(new Set<string>());
  const suppressRealtimeUntil = useRef(0);

  const syncFeedCommentCount = useCallback(
    (nextComments: RexComment[]) => {
      if (!rexId) return;
      patchFeedCommentCount(queryClient, rexId, totalRexCommentCount(nextComments));
    },
    [queryClient, rexId],
  );

  const loadComments = useCallback(
    async (opts?: { showLoading?: boolean }) => {
      if (!rexId) {
        setComments([]);
        setLoadError(false);
        setLoading(false);
        return;
      }
      const showLoading = opts?.showLoading === true;
      if (showLoading) setLoading(true);
      try {
        const next = await getRexComments(rexId);
        setComments(next);
        setLoadError(false);
        syncFeedCommentCount(next);
      } catch (e) {
        console.warn('[useRexComments]', e);
        if (showLoading) {
          setComments([]);
          setLoadError(true);
        }
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [rexId, syncFeedCommentCount],
  );

  useEffect(() => {
    void loadComments({ showLoading: true });
  }, [loadComments]);

  useEffect(() => {
    if (!rexId) return;

    return subscribeRealtimeWithResume({
      enabled: true,
      createChannel: () =>
        Backend.channel(`rex-comments-${rexId}`).on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'rex_comments',
            filter: `rex_id=eq.${rexId}`,
          },
          () => {
            if (Date.now() < suppressRealtimeUntil.current) return;
            void loadComments({ showLoading: false });
          },
        ),
      onSoftRefresh: () => {
        void loadComments({ showLoading: false });
      },
    });
  }, [rexId, loadComments]);

  const afterLocalWrite = useCallback(async () => {
    suppressRealtimeUntil.current = Date.now() + REALTIME_SELF_ECHO_MS;
    await loadComments({ showLoading: false });
  }, [loadComments]);

  const addComment = useCallback(
    async (body: string, parentCommentId?: string | null) => {
      if (!rexId || !user) return;
      if (!assertOnlineForMutation('Comments')) return;
      const parentId = parentCommentId ?? null;
      const tempId = `temp-${Date.now()}`;
      const optimistic = optimisticComment({
        tempId,
        rexId,
        body,
        parentCommentId: parentId,
        authorId: user.id,
        displayName:
          (typeof user.user_metadata?.display_name === 'string' &&
            user.user_metadata.display_name) ||
          user.email ||
          'You',
      });

      setComments((prev) => {
        const next = insertOptimisticComment(prev, optimistic);
        syncFeedCommentCount(next);
        return next;
      });
      suppressRealtimeUntil.current = Date.now() + REALTIME_SELF_ECHO_MS;

      try {
        await addRexComment({ rexId, body, parentCommentId: parentId }, comments);
        await afterLocalWrite();
      } catch (e: unknown) {
        setComments((prev) => {
          const next = removeCommentFromTree(prev, tempId);
          syncFeedCommentCount(next);
          return next;
        });
        throw new Error(unknownErrorMessage(e, 'Could not post comment'));
      }
    },
    [rexId, user, comments, afterLocalWrite, syncFeedCommentCount],
  );

  const deleteComment = useCallback(
    async (commentId: string) => {
      if (!assertOnlineForMutation('Comments')) return;
      const snapshot = comments;
      setComments((prev) => {
        const next = removeCommentFromTree(prev, commentId);
        syncFeedCommentCount(next);
        return next;
      });
      suppressRealtimeUntil.current = Date.now() + REALTIME_SELF_ECHO_MS;

      try {
        const deleted = await deleteRexComment(commentId);
        if (!deleted) {
          throw new Error('You can only delete your own comments');
        }
        await afterLocalWrite();
      } catch (e: unknown) {
        setComments(snapshot);
        syncFeedCommentCount(snapshot);
        throw new Error(unknownErrorMessage(e, 'Could not delete'));
      }
    },
    [comments, afterLocalWrite, syncFeedCommentCount],
  );

  const toggleCommentLike = useCallback(async (commentId: string, currentlyLiked: boolean) => {
    if (!assertOnlineForMutation('Comments')) return;
    if (commentLikeInFlight.current.has(commentId)) {
      return;
    }
    commentLikeInFlight.current.add(commentId);

    const nextLiked = !currentlyLiked;
    const delta = nextLiked ? 1 : -1;

    setComments((prev) =>
      updateCommentInTree(prev, commentId, (comment) => ({
        ...comment,
        liked_by_me: nextLiked,
        like_count: Math.max(0, (comment.like_count ?? 0) + delta),
      })),
    );

    try {
      if (nextLiked) {
        await likeRexComment(commentId);
      } else {
        await unlikeRexComment(commentId);
      }
    } catch (e) {
      setComments((prev) =>
        updateCommentInTree(prev, commentId, (comment) => ({
          ...comment,
          liked_by_me: currentlyLiked,
          like_count: Math.max(0, (comment.like_count ?? 0) - delta),
        })),
      );
      throw e;
    } finally {
      commentLikeInFlight.current.delete(commentId);
    }
  }, []);

  return {
    comments,
    loading,
    loadError,
    refetch: () => loadComments({ showLoading: true }),
    addComment,
    deleteComment,
    toggleCommentLike,
  };
}
