import { Backend, unwrap } from '~/shared/api/client';

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
