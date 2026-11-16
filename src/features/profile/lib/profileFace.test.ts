import { describe, expect, it } from 'vitest';
import { ACCOUNT_KIND } from '~/features/business-account/config/accountKind';
import { isBusinessProfileParam, withBusinessFace } from '~/features/profile/lib/profileFace';
import type { ProfileData } from '~/features/profile/types/profile';
import { toUserRoute } from '~/shared/config/routes';

const profile: ProfileData = {
  userId: 'user-1',
  displayName: 'Jane',
  handle: '@jane',
  avatarUrl: 'user-1/avatar.jpg',
  trustScore: 0,
  rexScore: 0,
  rexTier: null,
  rexCount: 0,
  followers: 0,
  following: 0,
  relationshipStatus: null,
  verified: true,
  accountKind: ACCOUNT_KIND.converted,
  business: {
    name: 'Acme Coffee',
    photoPath: 'user-1/business-1.jpg',
    verified: false,
    placeId: 'place-1',
  },
};

describe('isBusinessProfileParam', () => {
  it('matches the param written by the user route', () => {
    expect(String(toUserRoute('user-1', { asBusiness: true }))).toBe('/user/user-1?as=business');
    expect(isBusinessProfileParam('business')).toBe(true);
    expect(isBusinessProfileParam('personal')).toBe(false);
    expect(isBusinessProfileParam(undefined)).toBe(false);
  });
});

describe('withBusinessFace', () => {
  it('keeps the personal identity outside the business face', () => {
    expect(withBusinessFace(profile, false)).toBe(profile);
    expect(withBusinessFace({ ...profile, business: null }, true)).toEqual({
      ...profile,
      business: null,
    });
  });

  it('shows the business name, photo and verification on the business face', () => {
    expect(withBusinessFace(profile, true)).toEqual({
      ...profile,
      displayName: 'Acme Coffee',
      avatarUrl: 'user-1/business-1.jpg',
      verified: false,
    });
  });

  it('falls back to personal name and avatar when business ones are missing', () => {
    const business = { name: null, photoPath: null, verified: true, placeId: null };
    expect(withBusinessFace({ ...profile, business }, true)).toEqual({
      ...profile,
      business,
      verified: true,
    });
  });
});
