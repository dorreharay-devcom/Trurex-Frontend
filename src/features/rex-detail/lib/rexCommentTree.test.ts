import { describe, expect, it } from 'vitest';
import {
  insertOptimisticComment,
  removeCommentFromTree,
  resolveTopLevelReplyParentId,
  totalRexCommentCount,
  updateCommentInTree,
} from '~/features/rex-detail/lib/rexCommentTree';
import type { RexComment } from '~/features/rex-detail/types/rexComment';

function comment(partial: Partial<RexComment> & { id: string }): RexComment {
  return {
    id: partial.id,
    rex_id: partial.rex_id ?? 'rex-1',
    parent_comment_id: partial.parent_comment_id ?? null,
    author_id: partial.author_id ?? 'u1',
    body: partial.body ?? 'hi',
    created_at: partial.created_at ?? '2020-01-01',
    updated_at: partial.updated_at ?? '2020-01-01',
    like_count: partial.like_count ?? 0,
    liked_by_me: partial.liked_by_me ?? false,
    reply_count: partial.reply_count ?? 0,
    profile: partial.profile ?? {
      display_name: 'A',
      avatar_url: null,
      username: null,
      relationship_status: null,
    },
    replies: partial.replies ?? [],
  };
}

describe('comment optimistic tree', () => {
  it('inserts top-level optimistically at head', () => {
    const base = [comment({ id: 'c1' })];
    const next = insertOptimisticComment(base, comment({ id: 'temp' }));
    expect(next.map((c) => c.id)).toEqual(['temp', 'c1']);
    expect(totalRexCommentCount(next)).toBe(2);
  });

  it('inserts reply under parent and nested grandparent path', () => {
    const tree = [
      comment({
        id: 'c1',
        replies: [comment({ id: 'c2', parent_comment_id: 'c1', replies: [] })],
      }),
    ];
    const withReply = insertOptimisticComment(tree, comment({ id: 'r1', parent_comment_id: 'c2' }));
    expect(withReply[0]?.replies[0]?.replies.map((c) => c.id)).toEqual(['r1']);
    const updated = updateCommentInTree(withReply, 'r1', (c) => ({ ...c, body: 'edited' }));
    expect(updated[0]?.replies[0]?.replies[0]?.body).toBe('edited');
    const removed = removeCommentFromTree(
      [comment({ id: 'c1', replies: [comment({ id: 'r1', parent_comment_id: 'c1' })] })],
      'r1',
    );
    expect(removed[0]?.replies).toEqual([]);
    const untouched = updateCommentInTree(tree, 'missing', (c) => ({ ...c, body: 'x' }));
    expect(untouched[0]?.body).toBe('hi');
  });

  it('resolves top-level reply parent only', () => {
    expect(resolveTopLevelReplyParentId([comment({ id: 'c1' })], null)).toBeNull();
    expect(resolveTopLevelReplyParentId([comment({ id: 'c1' })], 'c1')).toBe('c1');
    expect(() => resolveTopLevelReplyParentId([comment({ id: 'c1' })], 'x')).toThrow();
  });

  it('rolls back optimistic delete', () => {
    const tree = [comment({ id: 'c1' }), comment({ id: 'c2' })];
    const after = removeCommentFromTree(tree, 'c1');
    expect(after.map((c) => c.id)).toEqual(['c2']);
  });
});
