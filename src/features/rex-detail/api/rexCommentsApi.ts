import { Backend, unwrap } from '~/shared/api/client';
import { resolveTopLevelReplyParentId } from '~/features/rex-detail/lib/rexCommentTree';
import type {
  RexComment,
  RexCommentDbRow,
  RexCommentLikeRow,
  RexCommentRpc,
} from '~/features/rex-detail/types/rexComment';

function mapRpcCommentFields(node: RexCommentRpc): Omit<RexComment, 'replies'> {
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
    reply_count: node.reply_count,
    profile: {
      display_name: node.author_display_name,
      avatar_url: node.author_profile_picture_url,
      username: node.author_username,
      relationship_status: node.author_relationship_status,
    },
  };
}

function mapRpcToReply(node: RexCommentRpc): RexComment {
  return {
    ...mapRpcCommentFields(node),
    replies: [],
  };
}

function mapRpcToComment(node: RexCommentRpc): RexComment {
  return {
    ...mapRpcCommentFields(node),
    replies: (node.subcomments ?? []).map(mapRpcToReply),
  };
}

export async function getRexComments(rexId: string): Promise<RexComment[]> {
  const data = unwrap(
    await Backend.rpc('get_rex_comments', {
      input_rex_id: rexId,
    }),
  ) as RexCommentRpc[] | null;
  const list = Array.isArray(data) ? data : [];
  return list.map(mapRpcToComment);
}

export async function addRexComment(
  params: {
    rexId: string;
    body: string;
    parentCommentId?: string | null;
  },
  existingComments: RexComment[] = [],
): Promise<RexCommentDbRow> {
  const trimmed = params.body.trim();
  if (!trimmed) {
    throw new Error('Comment cannot be empty');
  }

  const parentCommentId = resolveTopLevelReplyParentId(existingComments, params.parentCommentId);

  return unwrap(
    await Backend.rpc('add_rex_comment', {
      input_rex_id: params.rexId,
      input_body: trimmed,
      input_parent_comment_id: parentCommentId,
    }),
  ) as RexCommentDbRow;
}

export async function deleteRexComment(commentId: string): Promise<boolean> {
  const data = unwrap<boolean | null>(
    await Backend.rpc('delete_rex_comment', {
      input_comment_id: commentId,
    }),
  );
  return data === true;
}

export async function likeRexComment(commentId: string): Promise<RexCommentLikeRow> {
  return unwrap(
    await Backend.rpc('like_rex_comment', {
      input_comment_id: commentId,
    }),
  ) as RexCommentLikeRow;
}

export async function unlikeRexComment(commentId: string): Promise<boolean> {
  const data = unwrap<boolean | null>(
    await Backend.rpc('unlike_rex_comment', {
      input_comment_id: commentId,
    }),
  );
  return data === true;
}

export function canDeleteRexComment(comment: RexComment, currentUserId?: string): boolean {
  return Boolean(currentUserId && currentUserId === comment.author_id);
}
