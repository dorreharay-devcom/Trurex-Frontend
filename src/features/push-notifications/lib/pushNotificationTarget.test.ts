import { describe, expect, it } from 'vitest';
import { resolvePushNotificationHref } from '~/features/push-notifications/lib/pushNotificationTarget';
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
