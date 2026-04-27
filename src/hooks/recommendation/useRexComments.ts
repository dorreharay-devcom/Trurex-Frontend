import { useCallback, useEffect, useRef, useState } from 'react';
import { Backend, unwrap } from '~/services/AuthService';
import { likeRexComment, unlikeRexComment } from '~/api/rexLikesApi';
import type { RexComment, RexCommentRpcNode } from '~/types/recommendation/rexComment';

function mapRpcNodeToComment(node: RexCommentRpcNode): RexComment {
  return {
    id: node.id,
    rex_id: node.rex_id,
    parent_comment_id: node.parent_comment_id,
    author_id: node.author_id,
    body: node.body,
    created_at: node.created_at,
    updated_at: node.updated_at,
    like_count: node.like_count,
    liked_by_me: node.liked_by_me,
    profile: {
      display_name: node.author_display_name,
      avatar_url: node.author_profile_picture_url,
    },
    replies: (node.subcomments ?? []).map(mapRpcNodeToComment),
  };
}

function updateCommentInTree(
  items: RexComment[],
  commentId: string,
  map: (c: RexComment) => RexComment,
): RexComment[] {
  return items.map((c) => {
    if (c.id === commentId) {
      return map(c);
    }
    if (c.replies?.length) {
      return { ...c, replies: updateCommentInTree(c.replies, commentId, map) };
    }
    return c;
  });
}

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
      const data = unwrap(
        await Backend.rpc('get_rex_comments', {
          input_rex_id: rexId,
        }),
      ) as RexCommentRpcNode[] | null;
      const list = Array.isArray(data) ? data : [];
      setComments(list.map(mapRpcNodeToComment));
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
    if (!rexId) return;

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
      if (!rexId) return;
      const trimmed = body.trim();
      if (!trimmed) return;

      try {
        unwrap(
          await Backend.rpc('add_rex_comment', {
            input_rex_id: rexId,
            input_body: trimmed,
            input_parent_comment_id: parentCommentId ?? null,
          }),
        );
        await fetchComments();
      } catch (e: unknown) {
        const msg =
          e && typeof e === 'object' && 'message' in e
            ? String((e as Error).message)
            : 'Could not post comment';
        throw new Error(msg);
      }
    },
    [rexId, fetchComments],
  );

  const deleteComment = useCallback(
    async (commentId: string) => {
      try {
        unwrap(await Backend.from('rex_comments').delete().eq('id', commentId));
        await fetchComments();
      } catch (e: unknown) {
        const msg =
          e && typeof e === 'object' && 'message' in e
            ? String((e as Error).message)
            : 'Could not delete';
        throw new Error(msg);
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
      updateCommentInTree(prev, commentId, (c) => ({
        ...c,
        liked_by_me: nextLiked,
        like_count: Math.max(0, (c.like_count ?? 0) + delta),
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
        updateCommentInTree(prev, commentId, (c) => ({
          ...c,
          liked_by_me: currentlyLiked,
          like_count: Math.max(0, (c.like_count ?? 0) - delta),
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
