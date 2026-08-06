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

export function removeCommentFromTree(items: RexComment[], commentId: string): RexComment[] {
  const next: RexComment[] = [];
  for (const comment of items) {
    if (comment.id === commentId) continue;
    if (!comment.replies.length) {
      next.push(comment);
      continue;
    }
    const replies = removeCommentFromTree(comment.replies, commentId);
    if (replies.length === comment.replies.length) {
      next.push(comment);
      continue;
    }
    next.push({
      ...comment,
      replies,
      reply_count: Math.max(0, replies.length),
    });
  }
  return next;
}

export function insertOptimisticComment(tree: RexComment[], comment: RexComment): RexComment[] {
  if (!comment.parent_comment_id) {
    return [comment, ...tree];
  }
  return tree.map((node) => {
    if (node.id === comment.parent_comment_id) {
      return {
        ...node,
        reply_count: (node.reply_count ?? 0) + 1,
        replies: [...node.replies, comment],
      };
    }
    if (node.replies.length) {
      return { ...node, replies: insertOptimisticComment(node.replies, comment) };
    }
    return node;
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
