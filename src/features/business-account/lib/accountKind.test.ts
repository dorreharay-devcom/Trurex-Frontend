import { describe, expect, it } from 'vitest';
import { ACCOUNT_KIND } from '~/features/business-account/config/accountKind';
import { ACCOUNT_MODE, type AccountMode } from '~/features/business-account/config/accountMode';
import {
  canSwitchAccountMode,
  findProfile,
  resolveAccountKind,
  resolveEffectiveAccountMode,
  sendsActingHeader,
} from '~/features/business-account/lib/accountKind';
import type { MyProfile } from '~/features/business-account/types/myProfile';

function profile(id: string, kind: AccountMode): MyProfile {
  return { id, kind, displayName: id, handle: null, avatarUrl: null, verified: false };
}

const personal = profile('login-id', ACCOUNT_MODE.personal);
const business = profile('business-id', ACCOUNT_MODE.business);

describe('resolveAccountKind', () => {
  it('derives the kind from the profiles of the login', () => {
    expect(resolveAccountKind([])).toBe(ACCOUNT_KIND.regular);
    expect(resolveAccountKind([personal])).toBe(ACCOUNT_KIND.regular);
    expect(resolveAccountKind([personal, business])).toBe(ACCOUNT_KIND.converted);
    expect(resolveAccountKind([business])).toBe(ACCOUNT_KIND.businessOnly);
  });
});

describe('findProfile', () => {
  it('finds the profile of a kind', () => {
    expect(findProfile([personal, business], ACCOUNT_MODE.business)).toBe(business);
    expect(findProfile([business], ACCOUNT_MODE.personal)).toBeUndefined();
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

  it('lets converted accounts keep their stored mode and defaults them to personal', () => {
    expect(resolveEffectiveAccountMode(ACCOUNT_KIND.converted, ACCOUNT_MODE.business)).toBe(
      ACCOUNT_MODE.business,
    );
    expect(resolveEffectiveAccountMode(ACCOUNT_KIND.converted, null)).toBe(ACCOUNT_MODE.personal);
    expect(resolveEffectiveAccountMode(ACCOUNT_KIND.converted, undefined)).toBe(
      ACCOUNT_MODE.personal,
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

describe('sendsActingHeader', () => {
  it('sends the header only for a converted login acting as its business', () => {
    expect(sendsActingHeader(ACCOUNT_KIND.converted, ACCOUNT_MODE.business)).toBe(true);
    expect(sendsActingHeader(ACCOUNT_KIND.converted, ACCOUNT_MODE.personal)).toBe(false);
    expect(sendsActingHeader(ACCOUNT_KIND.businessOnly, ACCOUNT_MODE.business)).toBe(false);
    expect(sendsActingHeader(ACCOUNT_KIND.regular, ACCOUNT_MODE.personal)).toBe(false);
  });
});
