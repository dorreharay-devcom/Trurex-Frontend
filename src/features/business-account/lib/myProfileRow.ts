import { parseAccountMode } from '~/features/business-account/config/accountMode';
import type { MyProfile } from '~/features/business-account/types/myProfile';
import { firstNonEmptyString, isPlainObject, unknownAsArray } from '~/shared/lib/data/guards';

function toMyProfile(row: unknown): MyProfile | null {
  if (!isPlainObject(row)) return null;
  const id = firstNonEmptyString(row, 'id');
  const kind = parseAccountMode(row.kind);
  if (!id || !kind) return null;
  return {
    id,
    kind,
    displayName: firstNonEmptyString(row, 'display_name') ?? '',
    handle: firstNonEmptyString(row, 'handle'),
    avatarUrl: firstNonEmptyString(row, 'avatar_url'),
    verified: row.verified === true,
  };
}

export function toMyProfiles(data: unknown): MyProfile[] {
  return unknownAsArray<unknown>(data)
    .map(toMyProfile)
    .filter((profile): profile is MyProfile => profile != null);
}
