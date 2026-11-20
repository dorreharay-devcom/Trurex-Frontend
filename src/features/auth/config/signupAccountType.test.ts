import { describe, expect, it } from 'vitest';
import {
  SIGNUP_ACCOUNT_TYPE,
  SIGNUP_ACCOUNT_TYPE_CONFIG,
  isSignupAccountType,
  parseSignupAccountType,
  signupHref,
} from '~/features/auth/config/signupAccountType';

describe('parseSignupAccountType', () => {
  it('keeps known account types', () => {
    expect(parseSignupAccountType('personal')).toBe(SIGNUP_ACCOUNT_TYPE.personal);
    expect(parseSignupAccountType('business')).toBe(SIGNUP_ACCOUNT_TYPE.business);
  });

  it('falls back to personal for missing or unknown values', () => {
    expect(parseSignupAccountType(undefined)).toBe(SIGNUP_ACCOUNT_TYPE.personal);
    expect(parseSignupAccountType('BUSINESS')).toBe(SIGNUP_ACCOUNT_TYPE.personal);
    expect(parseSignupAccountType('x')).toBe(SIGNUP_ACCOUNT_TYPE.personal);
  });
});

describe('isSignupAccountType', () => {
  it('accepts only known account type strings', () => {
    expect(isSignupAccountType('personal')).toBe(true);
    expect(isSignupAccountType('business')).toBe(true);
    expect(isSignupAccountType('Business')).toBe(false);
    expect(isSignupAccountType('')).toBe(false);
    expect(isSignupAccountType(undefined)).toBe(false);
    expect(isSignupAccountType(1)).toBe(false);
  });
});

describe('SIGNUP_ACCOUNT_TYPE_CONFIG', () => {
  it('uses personal copy for personal sign-up', () => {
    const config = SIGNUP_ACCOUNT_TYPE_CONFIG[SIGNUP_ACCOUNT_TYPE.personal];
    expect(config.nameLabel).toBe('Full name');
    expect(config.namePlaceholder).toBe('Jane Doe');
    expect(config.tabLabel).toBe('Personal');
  });

  it('uses business copy for business sign-up', () => {
    const config = SIGNUP_ACCOUNT_TYPE_CONFIG[SIGNUP_ACCOUNT_TYPE.business];
    expect(config.nameLabel).toBe('Business Name');
    expect(config.namePlaceholder).toBe('Acme Coffee Co.');
    expect(config.tabLabel).toBe('Business');
  });

  it('validates the name with account-specific messages', () => {
    const personal = SIGNUP_ACCOUNT_TYPE_CONFIG[SIGNUP_ACCOUNT_TYPE.personal];
    const business = SIGNUP_ACCOUNT_TYPE_CONFIG[SIGNUP_ACCOUNT_TYPE.business];
    expect(personal.validateName('  ')).toBe('Full name is required');
    expect(personal.validateName('Jane Doe')).toBeUndefined();
    expect(business.validateName('  ')).toBe('Business name is required');
    expect(business.validateName('Acme Coffee Co.')).toBeUndefined();
  });
});

describe('signupHref', () => {
  it('points at the sign-up route with the account type param', () => {
    expect(signupHref(SIGNUP_ACCOUNT_TYPE.business)).toEqual({
      pathname: '/signup',
      params: { account: 'business' },
    });
    expect(signupHref(SIGNUP_ACCOUNT_TYPE.personal)).toEqual({
      pathname: '/signup',
      params: { account: 'personal' },
    });
  });
});
