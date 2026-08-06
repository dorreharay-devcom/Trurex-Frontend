import { describe, expect, it } from 'vitest';
import {
  isLikelyJwt,
  isSafeOAuthCallbackUrl,
  isSafeOAuthCode,
  isSafeRefreshToken,
} from '~/features/auth/lib/oauthCallback';

describe('oauth credential shaping', () => {
  it('accepts pkce-like codes and rejects spaces', () => {
    expect(isSafeOAuthCode('ok-code_123~')).toBe(true);
    expect(isSafeOAuthCode('bad code')).toBe(false);
    expect(isSafeOAuthCode('')).toBe(false);
  });

  it('validates jwt access and opaque refresh tokens separately', () => {
    expect(isLikelyJwt('aaa.bbb.ccc')).toBe(true);
    expect(isLikelyJwt('opaque-token')).toBe(false);
    expect(isSafeRefreshToken('opaque-refresh_token+/==')).toBe(true);
    expect(isSafeRefreshToken('bad token')).toBe(false);
  });

  it('matches authority for web and app schemes', () => {
    expect(
      isSafeOAuthCallbackUrl(
        'https://app.trurex.com/auth/callback?code=1',
        'https://app.trurex.com/auth/callback',
      ),
    ).toBe(true);
    expect(isSafeOAuthCallbackUrl('trurex://auth/callback?code=1', 'trurex://auth/callback')).toBe(
      true,
    );
    expect(
      isSafeOAuthCallbackUrl(
        'trurex://auth/callback?code=1',
        'https://app.trurex.com/auth/callback',
      ),
    ).toBe(false);
    expect(isSafeOAuthCallbackUrl('not a url', 'trurex://auth/callback')).toBe(false);
  });
});
