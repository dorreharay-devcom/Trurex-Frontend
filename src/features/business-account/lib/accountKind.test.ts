import { describe, expect, it } from 'vitest';
import { ACCOUNT_KIND } from '~/features/business-account/config/accountKind';
import { ACCOUNT_MODE } from '~/features/business-account/config/accountMode';
import {
  canSwitchAccountMode,
  isPostingAsBusiness,
  resolveAccountKind,
  resolveEffectiveAccountMode,
} from '~/features/business-account/lib/accountKind';

describe('resolveAccountKind', () => {
  it('trusts the account type from user config', () => {
    expect(resolveAccountKind({ accountType: 'regular', isBusinessAccount: true })).toBe(
      ACCOUNT_KIND.regular,
    );
    expect(resolveAccountKind({ accountType: 'converted', isBusinessAccount: true })).toBe(
      ACCOUNT_KIND.converted,
    );
    expect(resolveAccountKind({ accountType: 'business_only', isBusinessAccount: true })).toBe(
      ACCOUNT_KIND.businessOnly,
    );
  });

  it('falls back to the business flag when the account type is unknown', () => {
    expect(resolveAccountKind({ accountType: undefined, isBusinessAccount: false })).toBe(
      ACCOUNT_KIND.regular,
    );
    expect(resolveAccountKind({ accountType: 'other', isBusinessAccount: true })).toBe(
      ACCOUNT_KIND.businessOnly,
    );
  });
});

describe('resolveEffectiveAccountMode', () => {
  it('forces personal for regular and business for business-only accounts', () => {
    expect(resolveEffectiveAccountMode(ACCOUNT_KIND.regular, ACCOUNT_MODE.business)).toBe(
      ACCOUNT_MODE.personal,
    );
    expect(resolveEffectiveAccountMode(ACCOUNT_KIND.businessOnly, ACCOUNT_MODE.personal)).toBe(
      ACCOUNT_MODE.business,
    );
  });

  it('lets converted accounts keep their stored mode and defaults them to business', () => {
    expect(resolveEffectiveAccountMode(ACCOUNT_KIND.converted, ACCOUNT_MODE.personal)).toBe(
      ACCOUNT_MODE.personal,
    );
    expect(resolveEffectiveAccountMode(ACCOUNT_KIND.converted, null)).toBe(ACCOUNT_MODE.business);
    expect(resolveEffectiveAccountMode(ACCOUNT_KIND.converted, undefined)).toBe(
      ACCOUNT_MODE.business,
    );
  });
});

describe('canSwitchAccountMode', () => {
  it('allows switching only for converted accounts', () => {
    expect(canSwitchAccountMode(ACCOUNT_KIND.converted)).toBe(true);
    expect(canSwitchAccountMode(ACCOUNT_KIND.regular)).toBe(false);
    expect(canSwitchAccountMode(ACCOUNT_KIND.businessOnly)).toBe(false);
  });
});

describe('isPostingAsBusiness', () => {
  it('posts as business only in business mode', () => {
    expect(isPostingAsBusiness(ACCOUNT_MODE.business)).toBe(true);
    expect(isPostingAsBusiness(ACCOUNT_MODE.personal)).toBe(false);
  });
});
