import type { NetworkUserRow } from '~/features/circles/types/networkUser';
import {
  coerceId,
  finiteNum,
  isFiniteNumber,
  optStr,
  optStrUndef,
  parseRelationshipStatus,
  unknownAsArray,
} from '~/shared/lib/data/guards';

export function normalizeNetworkUserRow(r: Record<string, unknown>): NetworkUserRow {
  const row: NetworkUserRow = {
    user_id: coerceId(r.user_id),
    display_name: optStr(r.display_name) ?? 'Member',
    handle: optStr(r.handle),
    avatar_url: optStr(r.avatar_url),
    trust_score: finiteNum(r.trust_score),
    relationship_status: parseRelationshipStatus(r.relationship_status),
    followed_at: optStrUndef(r.followed_at),
    bio: optStr(r.bio),
  };
  if (isFiniteNumber(r.followers_count)) row.followers_count = r.followers_count;
  if (isFiniteNumber(r.following_count)) row.following_count = r.following_count;
  if (isFiniteNumber(r.rexes_created_count)) row.rexes_created_count = r.rexes_created_count;
  return row;
}

export function parseNetworkUserRows(payload: unknown): NetworkUserRow[] {
  return unknownAsArray<Record<string, unknown>>(payload)
    .map(normalizeNetworkUserRow)
    .filter((u) => u.user_id);
}
