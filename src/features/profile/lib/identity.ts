import type { ProfileData } from '~/features/profile/types/profile';

type Params = {
  profile: ProfileData | null;
  propUserId?: string;
  propHandle?: string;
  authUserId?: string | null;
};

export function resolveIsOwnProfile({
  profile,
  propUserId,
  propHandle,
  authUserId,
}: Params): boolean {
  if (profile != null) return profile.userId === authUserId;
  if (propUserId) return propUserId === authUserId;
  if (propHandle) return false;
  return true;
}

export function resolveProfileContentUserId({
  profile,
  propUserId,
  propHandle,
  authUserId,
}: Params): string | undefined {
  if (profile?.userId) return profile.userId;
  if (propUserId) return propUserId;
  if (propHandle) return undefined;
  return authUserId ?? undefined;
}
