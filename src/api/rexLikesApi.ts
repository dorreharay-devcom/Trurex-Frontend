import { Backend, unwrap } from '~/services/AuthService';

export type RexLikeRow = {
  user_id: string;
  rex_id: string;
  created_at: string;
};

export async function likeRex(rexId: string): Promise<RexLikeRow> {
  return unwrap(
    await Backend.rpc('like_rex', {
      input_rex_id: rexId,
    }),
  ) as RexLikeRow;
}

export async function unlikeRex(rexId: string): Promise<boolean> {
  const data = unwrap<boolean | null>(
    await Backend.rpc('unlike_rex', {
      input_rex_id: rexId,
    }),
  );
  return data === true;
}

export async function likeRexComment(commentId: string): Promise<void> {
  unwrap(
    await Backend.rpc('like_rex_comment', {
      input_comment_id: commentId,
    }),
  );
}

export async function unlikeRexComment(commentId: string): Promise<void> {
  unwrap(
    await Backend.rpc('unlike_rex_comment', {
      input_comment_id: commentId,
    }),
  );
}
