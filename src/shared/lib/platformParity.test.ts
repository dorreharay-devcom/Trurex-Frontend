import { describe, expect, it } from 'vitest';
import {
  isLikelyJwt,
  isOAuthCallbackPath,
  isSafeOAuthCallbackUrl,
  isSafeOAuthCode,
} from '~/features/auth/lib/oauthCallback';
import {
  isRateLimitError,
  isTimeoutError,
  userFacingNetworkErrorMessage,
} from '~/shared/lib/errors/network';
import { ApiTimeoutError } from '~/shared/api/fetchWithTimeout';
import { parseOptionalRouteId } from '~/shared/lib/navigation/routeIds';
import { buttonA11y, headerA11y, liveRegionA11y, tabA11y } from '~/shared/lib/a11y';

describe('network error mapping', () => {
  it('detects timeouts', () => {
    expect(isTimeoutError(new ApiTimeoutError())).toBe(true);
    expect(userFacingNetworkErrorMessage(new ApiTimeoutError(), 'x')).toMatch(/timed out/i);
  });

  it('detects 429 rate limits', () => {
    expect(isRateLimitError({ status: 429, message: 'slow down' })).toBe(true);
    expect(isRateLimitError({ code: 'over_request_rate_limit' })).toBe(true);
    expect(userFacingNetworkErrorMessage({ status: 429 }, 'x')).toMatch(/too many/i);
  });
});

describe('oauth callback hardening', () => {
  it('accepts matching scheme path for native', () => {
    const redirect = 'trurex://auth/callback';
    expect(isSafeOAuthCallbackUrl('trurex://auth/callback?code=abc', redirect)).toBe(true);
  });

  it('rejects wrong scheme', () => {
    expect(
      isSafeOAuthCallbackUrl(
        'https://evil.example/auth/callback?code=abc',
        'trurex://auth/callback',
      ),
    ).toBe(false);
  });

  it('accepts matching web origin callback', () => {
    expect(
      isSafeOAuthCallbackUrl(
        'https://app.trurex.com/auth/callback?code=abc',
        'https://app.trurex.com/auth/callback',
      ),
    ).toBe(true);
    expect(
      isSafeOAuthCallbackUrl(
        'https://evil.example/auth/callback?code=abc',
        'https://app.trurex.com/auth/callback',
      ),
    ).toBe(false);
  });

  it('validates code/jwt shapes', () => {
    expect(isSafeOAuthCode('ok-code_123')).toBe(true);
    expect(isSafeOAuthCode('bad code')).toBe(false);
    expect(isLikelyJwt('aaa.bbb.ccc')).toBe(true);
    expect(isLikelyJwt('not-a-jwt')).toBe(false);
    expect(isOAuthCallbackPath('/auth/callback')).toBe(true);
  });
});

describe('route id parsers (web/native deep links)', () => {
  it('accepts only UUID route ids', () => {
    expect(parseOptionalRouteId('550e8400-e29b-41d4-a716-446655440000')).toBe(
      '550e8400-e29b-41d4-a716-446655440000',
    );
    expect(parseOptionalRouteId('not-a-uuid')).toBeNull();
    expect(parseOptionalRouteId(['550e8400-e29b-41d4-a716-446655440000'])).toBe(
      '550e8400-e29b-41d4-a716-446655440000',
    );
  });
});

describe('a11y helpers', () => {
  it('builds button, tab, header, and live region props', () => {
    expect(buttonA11y('Retry', { disabled: true, selected: false, hint: 'again' })).toMatchObject({
      accessibilityRole: 'button',
      accessibilityHint: 'again',
      accessibilityState: { disabled: true, selected: false },
    });
    expect(tabA11y('Discover', true).accessibilityState).toEqual({ selected: true });
    expect(headerA11y('Profile').accessibilityRole).toBe('header');
    expect(liveRegionA11y("You're offline").accessibilityLiveRegion).toBe('polite');
  });
});
