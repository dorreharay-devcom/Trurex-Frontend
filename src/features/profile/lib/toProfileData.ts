import type { ProfileData, ProfileUserRow } from '~/features/profile/types/profile';
import { parseRelationshipStatus } from '~/shared/lib/data/guards';

function formatHandle(raw: string): string {
  if (!raw) return '';
  return raw.startsWith('@') ? raw : `@${raw}`;
}

export function toProfileData(row: ProfileUserRow): ProfileData {
  const handle = row.handle ?? '';
  return {
    userId: row.user_id || row.id || '',
    displayName: row.display_name || 'Anonymous',
    handle: formatHandle(handle),
    bio: row.bio ?? '',
    location: row.location ?? '',
    avatarUrl: row.avatar_url || null,
    trustScore: row.trust_score ?? 0,
    rexScore: row.rex_score ?? 0,
    rexTier: row.rex_tier ?? null,
    rexCount: row.rexes_created_count ?? 0,
    followers: row.followers_count ?? 0,
    following: row.following_count ?? 0,
    relationshipStatus: parseRelationshipStatus(row.relationship_status),
    currently: {
      binging: row.currently_binging || undefined,
      listening: row.currently_listening_to || undefined,
      reading: row.currently_reading || undefined,
    },
  };
}
