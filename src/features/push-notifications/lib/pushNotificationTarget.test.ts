import { describe, expect, it } from 'vitest';
import { ACCOUNT_MODE } from '~/features/business-account/config/accountMode';
import type { MyProfile } from '~/features/business-account/types/myProfile';
import {
  resolvePushAccountMode,
  resolvePushNotificationHref,
} from '~/features/push-notifications/lib/pushNotificationTarget';
import { Routes, toRexRequestRoute } from '~/shared/config/routes';

describe('resolvePushNotificationHref', () => {
  it('opens My Business Page after a business claim approval', () => {
    expect(resolvePushNotificationHref({ type: 'business_claim_approved' })).toBe(
      Routes.MyBusinessPage,
    );
  });

  it('opens the rex request from the request_id push field', () => {
    expect(resolvePushNotificationHref({ type: 'rex_request', request_id: 'req-1' })).toEqual(
      toRexRequestRoute('req-1'),
    );
    expect(
      resolvePushNotificationHref({ type: 'rex_request_response', rex_request_id: 'req-2' }),
    ).toEqual(toRexRequestRoute('req-2'));
  });

  it('keeps the existing tier upgrade destination', () => {
    expect(resolvePushNotificationHref({ type: 'tier_upgrade' })).toBe(Routes.Profile);
  });
});

describe('resolvePushAccountMode', () => {
  const profiles: MyProfile[] = [
    {
      id: 'login-id',
      kind: ACCOUNT_MODE.personal,
      displayName: 'Nataliia',
      handle: 'nataliia',
      avatarUrl: null,
      verified: false,
    },
    {
      id: 'business-id',
      kind: ACCOUNT_MODE.business,
      displayName: 'Dior Shop',
      handle: null,
      avatarUrl: null,
      verified: true,
    },
  ];

  it('opens the profile the push was addressed to', () => {
    expect(resolvePushAccountMode({ type: 'comment', profile_id: 'business-id' }, profiles)).toBe(
      ACCOUNT_MODE.business,
    );
    expect(resolvePushAccountMode({ type: 'comment', profile_id: 'login-id' }, profiles)).toBe(
      ACCOUNT_MODE.personal,
    );
  });

  it('switches by profile_id only and ignores unknown profiles', () => {
    expect(
      resolvePushAccountMode(
        { type: 'business_claim_approved', profile_id: 'business-id' },
        profiles,
      ),
    ).toBe(ACCOUNT_MODE.business);
    expect(resolvePushAccountMode({ type: 'business_claim_approved' }, profiles)).toBeNull();
    expect(resolvePushAccountMode({ type: 'comment', profile_id: 'someone' }, profiles)).toBeNull();
    expect(resolvePushAccountMode({ type: 'comment' }, profiles)).toBeNull();
  });
});
