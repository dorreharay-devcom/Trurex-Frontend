import { useCallback, useEffect, useRef, useState } from 'react';
import { Backend } from '~/services/AuthService';
import {
  addRexComment,
  deleteRexComment,
  getRexComments,
  likeRexComment,
  unlikeRexComment,
} from '~/api/rexCommentsApi';
import { updateCommentInTree } from '~/utils/recommendation/rexCommentTree';
import type { RexComment } from '~/types/recommendation/rexComment';
import { unknownErrorMessage } from '~/utils';

export function useRexComments(rexId: string | undefined) {
  const [comments, setComments] = useState<RexComment[]>([]);
  const [loading, setLoading] = useState(true);
  const commentLikeInFlight = useRef(new Set<string>());

  const fetchComments = useCallback(async () => {
    if (!rexId) {
      setComments([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setComments(await getRexComments(rexId));
    } catch (e) {
      console.warn('[useRexComments]', e);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [rexId]);

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
