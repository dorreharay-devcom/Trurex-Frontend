import { ACCOUNT_KIND, type AccountKind } from '~/features/business-account/config/accountKind';
import { resolveAccountKind } from '~/features/business-account/lib/accountKind';
import type {
  ProfileBusinessIdentity,
  ProfileData,
  ProfileUserRow,
} from '~/features/profile/types/profile';
import { parseRelationshipStatus } from '~/shared/lib/data/guards';

function formatHandle(raw: string): string {
  if (!raw) return '';
  return raw.startsWith('@') ? raw : `@${raw}`;
}

function toBusinessIdentity(
  row: ProfileUserRow,
  accountKind: AccountKind,
): ProfileBusinessIdentity | null {
  if (accountKind === ACCOUNT_KIND.regular) return null;
  return {
    name: row.business_name || null,
    photoPath: row.business_photo_path || null,
    verified: row.is_verified_business === true,
    placeId: row.business_place_id || null,
  };
}

export function toProfileData(row: ProfileUserRow): ProfileData {
  const handle = row.handle ?? '';
  const accountKind = resolveAccountKind({
    accountType: row.account_type,
    isBusinessAccount: row.is_business_account === true,
  });
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
    verified: Boolean(row.verified),
    accountKind,
    business: toBusinessIdentity(row, accountKind),
    currently: {
      binging: row.currently_binging || undefined,
      listening: row.currently_listening_to || undefined,
      reading: row.currently_reading || undefined,
    },
  };
}
