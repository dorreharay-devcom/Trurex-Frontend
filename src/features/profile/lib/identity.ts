import type { ProfileData } from '~/features/profile/types/profile';

type Params = {
  profile: ProfileData | null;
  propUserId?: string;
  propHandle?: string;
  viewerId?: string | null;
};

export function resolveIsOwnProfile({
  profile,
  propUserId,
  propHandle,
  viewerId,
}: Params): boolean {
  if (profile != null) return profile.userId === viewerId;
  if (propUserId) return propUserId === viewerId;
  if (propHandle) return false;
  return true;
}

export function resolveProfileContentUserId({
  profile,
  propUserId,
  propHandle,
  viewerId,
}: Params): string | undefined {
  if (profile?.userId) return profile.userId;
  if (propUserId) return propUserId;
  if (propHandle) return undefined;
  return viewerId ?? undefined;
}
