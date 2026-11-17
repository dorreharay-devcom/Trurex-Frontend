import { describe, expect, it } from 'vitest';
import { resolvePushNotificationHref } from '~/features/push-notifications/lib/pushNotificationTarget';
import { Routes } from '~/shared/config/routes';

describe('resolvePushNotificationHref', () => {
  it('opens My Business Page after a business claim approval', () => {
    expect(resolvePushNotificationHref({ type: 'business_claim_approved' })).toBe(
      Routes.MyBusinessPage,
    );
  });

  it('keeps the existing tier upgrade destination', () => {
    expect(resolvePushNotificationHref({ type: 'tier_upgrade' })).toBe(Routes.Profile);
  });
});
