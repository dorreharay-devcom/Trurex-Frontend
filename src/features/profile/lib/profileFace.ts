import type { ProfileData } from '~/features/profile/types/profile';

const BUSINESS_PROFILE_PARAM = 'business';

export function isBusinessProfileParam(value: string | undefined): boolean {
  return value === BUSINESS_PROFILE_PARAM;
}

export function withBusinessFace(profile: ProfileData, businessFace: boolean): ProfileData {
  if (!businessFace || !profile.business) return profile;
  return {
    ...profile,
    displayName: profile.business.name ?? profile.displayName,
    avatarUrl: profile.business.photoPath ?? profile.avatarUrl,
    verified: profile.business.verified,
  };
}
