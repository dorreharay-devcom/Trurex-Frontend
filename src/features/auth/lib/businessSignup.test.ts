import { describe, expect, it } from 'vitest';
import {
  BUSINESS_SIGNUP_ERROR_CODE,
  isBusinessSignupIneligibleError,
  isBusinessSignupInvalidNameError,
  requiresBusinessSignup,
} from '~/features/auth/lib/businessSignup';

describe('requiresBusinessSignup', () => {
  it('requires completion unless the account is already a business account', () => {
    expect(requiresBusinessSignup(null)).toBe(true);
    expect(requiresBusinessSignup({})).toBe(true);
    expect(requiresBusinessSignup({ is_business_account: null })).toBe(true);
    expect(requiresBusinessSignup({ is_business_account: false })).toBe(true);
    expect(requiresBusinessSignup({ is_business_account: true })).toBe(false);
  });
});

describe('business sign-up error codes', () => {
  it('maps the backend codes', () => {
    expect(BUSINESS_SIGNUP_ERROR_CODE).toEqual({ ineligible: 'BIZ01', invalidName: '22023' });
  });

  it('detects the ineligible error on plain objects and Error instances', () => {
    expect(isBusinessSignupIneligibleError({ code: 'BIZ01', message: 'taken' })).toBe(true);
    expect(
      isBusinessSignupIneligibleError(Object.assign(new Error('taken'), { code: 'BIZ01' })),
    ).toBe(true);
    expect(isBusinessSignupIneligibleError({ code: '22023' })).toBe(false);
    expect(isBusinessSignupIneligibleError(new Error('BIZ01'))).toBe(false);
    expect(isBusinessSignupIneligibleError('BIZ01')).toBe(false);
    expect(isBusinessSignupIneligibleError(null)).toBe(false);
  });

  it('detects the invalid name error', () => {
    expect(isBusinessSignupInvalidNameError({ code: '22023' })).toBe(true);
    expect(isBusinessSignupInvalidNameError({ code: 'BIZ01' })).toBe(false);
    expect(isBusinessSignupInvalidNameError(undefined)).toBe(false);
  });
});
