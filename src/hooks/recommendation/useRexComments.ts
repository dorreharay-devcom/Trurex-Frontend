import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Backend } from '~/shared/api/client';
import {
  addRexComment,
  deleteRexComment,
  getRexComments,
  likeRexComment,
  unlikeRexComment,
} from '~/api/rexCommentsApi';
import { totalRexCommentCount, updateCommentInTree } from '~/utils/recommendation/rexCommentTree';
import { patchFeedCommentCount } from '~/utils/recommendation/patchFeedCommentCount';
import type { RexComment } from '~/types/recommendation/rexComment';
import { unknownErrorMessage } from '~/utils';

export function useRexComments(rexId: string | undefined) {
  const queryClient = useQueryClient();
  const [comments, setComments] = useState<RexComment[]>([]);
  const [loading, setLoading] = useState(true);
  const commentLikeInFlight = useRef(new Set<string>());

  const syncFeedCommentCount = useCallback(
    (nextComments: RexComment[]) => {
      if (!rexId) return;
      patchFeedCommentCount(queryClient, rexId, totalRexCommentCount(nextComments));
    },
    [queryClient, rexId],
  );

  const fetchComments = useCallback(async () => {
    if (!rexId) {
      setComments([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const next = await getRexComments(rexId);
      setComments(next);
      syncFeedCommentCount(next);
    } catch (e) {
      console.warn('[useRexComments]', e);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [rexId, syncFeedCommentCount]);

  useEffect(() => {
    void fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    if (!rexId) {
      return;
    }

    const channel = Backend.channel(`rex-comments-${rexId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rex_comments',
          filter: `rex_id=eq.${rexId}`,
        },
        () => {
          void fetchComments();
        },
      )
      .subscribe();

    return () => {
      void Backend.removeChannel(channel);
    };
  }, [rexId, fetchComments]);

  const addComment = useCallback(
    async (body: string, parentCommentId?: string | null) => {
      if (!rexId) {
        return;
      }
      try {
        await addRexComment({ rexId, body, parentCommentId }, comments);
        await fetchComments();
      } catch (e: unknown) {
        throw new Error(unknownErrorMessage(e, 'Could not post comment'));
      }
    },
    [rexId, fetchComments, comments],
  );

  const deleteComment = useCallback(
    async (commentId: string) => {
      try {
        const deleted = await deleteRexComment(commentId);
        if (!deleted) {
          throw new Error('You can only delete your own comments');
        }
        await fetchComments();
      } catch (e: unknown) {
        throw new Error(unknownErrorMessage(e, 'Could not delete'));
      }
    },
    [fetchComments],
  );

  const toggleCommentLike = useCallback(async (commentId: string, currentlyLiked: boolean) => {
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
    refetch: fetchComments,
    addComment,
    deleteComment,
    toggleCommentLike,
  };
}
