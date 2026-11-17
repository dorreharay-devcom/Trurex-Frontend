import { describe, expect, it } from 'vitest';
import { ACCOUNT_KIND, parseAccountKind } from '~/features/business-account/config/accountKind';
import { ACCOUNT_MODE, parseAccountMode } from '~/features/business-account/config/accountMode';
import {
  BUSINESS_PROFILE_VIEW,
  parseBusinessProfileViewParam,
} from '~/features/business-account/config/businessProfileView';
import {
  BUSINESS_CLAIM_STATUS,
  parseBusinessClaimStatus,
} from '~/features/business-account/config/claimStatus';
import { Routes } from '~/shared/config/routes';

describe('parseAccountMode', () => {
  it('accepts known modes only', () => {
    expect(parseAccountMode('personal')).toBe(ACCOUNT_MODE.personal);
    expect(parseAccountMode('business')).toBe(ACCOUNT_MODE.business);
    expect(parseAccountMode('Business')).toBeNull();
    expect(parseAccountMode(null)).toBeNull();
    expect(parseAccountMode(1)).toBeNull();
  });
});

describe('parseAccountKind', () => {
  it('accepts the backend account types only', () => {
    expect(parseAccountKind('regular')).toBe(ACCOUNT_KIND.regular);
    expect(parseAccountKind('converted')).toBe(ACCOUNT_KIND.converted);
    expect(parseAccountKind('business_only')).toBe(ACCOUNT_KIND.businessOnly);
    expect(parseAccountKind('businessOnly')).toBeNull();
    expect(parseAccountKind(null)).toBeNull();
  });
});

describe('parseBusinessClaimStatus', () => {
  it('accepts known statuses only', () => {
    expect(parseBusinessClaimStatus('pending')).toBe(BUSINESS_CLAIM_STATUS.pending);
    expect(parseBusinessClaimStatus('approved')).toBe(BUSINESS_CLAIM_STATUS.approved);
    expect(parseBusinessClaimStatus('rejected')).toBe(BUSINESS_CLAIM_STATUS.rejected);
    expect(parseBusinessClaimStatus('unknown')).toBeNull();
    expect(parseBusinessClaimStatus(undefined)).toBeNull();
  });
});

describe('parseBusinessProfileViewParam', () => {
  it('defaults to the business-as-user view', () => {
    expect(parseBusinessProfileViewParam('page')).toBe(BUSINESS_PROFILE_VIEW.page);
    expect(parseBusinessProfileViewParam('asUser')).toBe(BUSINESS_PROFILE_VIEW.asUser);
    expect(parseBusinessProfileViewParam('junk')).toBe(BUSINESS_PROFILE_VIEW.asUser);
    expect(parseBusinessProfileViewParam(undefined)).toBe(BUSINESS_PROFILE_VIEW.asUser);
  });

  it('keeps the My Business Page route in sync with the view param', () => {
    expect(Routes.MyBusinessPage).toBe(`${Routes.Profile}?view=${BUSINESS_PROFILE_VIEW.page}`);
  });
});
