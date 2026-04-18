import { useCallback, useEffect, useState } from 'react';
import { Backend, unwrap } from '~/services/AuthService';
import type { RexComment, RexCommentRow } from '~/types/recommendation/rexComment';

type UserLite = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
};

function buildThreadedTree(flat: RexComment[]): RexComment[] {
  const byId = new Map(flat.map((c) => [c.id, c]));
  const roots: RexComment[] = [];
  for (const c of flat) {
    const pid = c.parent_comment_id;
    if (pid) {
      const parent = byId.get(pid);
      if (parent) {
        parent.replies = parent.replies ?? [];
        parent.replies.push(c);
      } else {
        roots.push(c);
      }
    } else {
      roots.push(c);
    }
  }
  return roots;
}

export function useRexComments(rexId: string | undefined) {
  const [comments, setComments] = useState<RexComment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    if (!rexId) {
      setComments([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await Backend.from('rex_comments')
        .select('*')
        .eq('rex_id', rexId)
        .order('created_at', { ascending: true });

      if (error) {
        console.warn('[useRexComments]', error.message);
        setComments([]);
        setLoading(false);
        return;
      }

      const rows = (data ?? []) as RexCommentRow[];
      if (rows.length === 0) {
        setComments([]);
        setLoading(false);
        return;
      }

      const authorIds = [...new Set(rows.map((r) => r.author_id))];
      const { data: usersData } = await Backend.from('users')
        .select('id, display_name, avatar_url')
        .in('id', authorIds);

      const userMap = new Map((usersData as UserLite[] | null)?.map((u) => [u.id, u]) ?? []);

      const withProfiles: RexComment[] = rows.map((r) => {
        const u = userMap.get(r.author_id);
        return {
          ...r,
          profile: u
            ? { display_name: u.display_name, avatar_url: u.avatar_url }
            : { display_name: null, avatar_url: null },
          replies: [] as RexComment[],
        };
      });

      const hasThreading = rows.some((r) => r.parent_comment_id);
      setComments(hasThreading ? buildThreadedTree(withProfiles) : withProfiles);
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
        if (parentCommentId) {
          const { error } = await Backend.from('rex_comments').insert({
            rex_id: rexId,
            body: trimmed,
            parent_comment_id: parentCommentId,
          });
          if (error) throw error;
        } else {
          unwrap(
            await Backend.rpc('add_rex_comment', {
              input_rex_id: rexId,
              input_body: trimmed,
            }),
          );
        }
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

  return { comments, loading, refetch: fetchComments, addComment, deleteComment };
}
