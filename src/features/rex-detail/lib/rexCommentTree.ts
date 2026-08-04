import type { RexComment } from '~/features/rex-detail/types/rexComment';

export function updateCommentInTree(
  items: RexComment[],
  commentId: string,
  map: (comment: RexComment) => RexComment,
): RexComment[] {
  return items.map((comment) => {
    if (comment.id === commentId) {
      return map(comment);
    }
    if (comment.replies.length) {
      return {
        ...comment,
        replies: updateCommentInTree(comment.replies, commentId, map),
      };
    }
    return comment;
  });
}

export function totalRexCommentCount(items: RexComment[]): number {
  let count = 0;
  const walk = (list: RexComment[]) => {
    for (const comment of list) {
      count += 1;
      if (comment.replies.length) {
        walk(comment.replies);
      }
    }
  };
  walk(items);
  return count;
}

export function resolveTopLevelReplyParentId(
  comments: RexComment[],
  parentCommentId: string | null | undefined,
): string | null {
  if (!parentCommentId) {
    return null;
  }
  const isTopLevel = comments.some((comment) => comment.id === parentCommentId);
  if (!isTopLevel) {
    throw new Error('You can only reply to a top-level comment');
  }
  return parentCommentId;
}
