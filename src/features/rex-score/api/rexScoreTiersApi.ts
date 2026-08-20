import { Backend, unwrap } from '~/shared/api/client';
import type { RexScoreTier } from '~/features/rex-score/types/rexScoreTier';

export async function fetchRexScoreTiers(): Promise<RexScoreTier[]> {
  const data = unwrap(await Backend.rpc('get_rex_score_tiers'));
  return Array.isArray(data) ? (data as RexScoreTier[]) : [];
}
