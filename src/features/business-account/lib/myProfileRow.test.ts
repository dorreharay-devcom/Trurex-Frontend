import { describe, expect, it } from 'vitest';
import { toMyProfiles } from '~/features/business-account/lib/myProfileRow';

describe('toMyProfiles', () => {
  it('maps get_my_profiles rows and drops malformed ones', () => {
    expect(
      toMyProfiles([
        {
          id: 'login-id',
          kind: 'personal',
          display_name: 'Nataliia',
          handle: 'nataliia',
          avatar_url: 'login-id/avatar.jpg',
          verified: true,
        },
        {
          id: 'business-id',
          kind: 'business',
          display_name: 'Dior Shop',
          handle: null,
          avatar_url: 'login-id/business.jpg',
        },
        { id: 'broken', kind: 'other' },
        { kind: 'personal' },
      ]),
    ).toEqual([
      {
        id: 'login-id',
        kind: 'personal',
        displayName: 'Nataliia',
        handle: 'nataliia',
        avatarUrl: 'login-id/avatar.jpg',
        verified: true,
      },
      {
        id: 'business-id',
        kind: 'business',
        displayName: 'Dior Shop',
        handle: null,
        avatarUrl: 'login-id/business.jpg',
        verified: false,
      },
    ]);
  });
});
