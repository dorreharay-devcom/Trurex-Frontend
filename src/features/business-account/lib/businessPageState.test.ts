import { describe, expect, it } from 'vitest';
import { ACCOUNT_KIND } from '~/features/business-account/config/accountKind';
import { BUSINESS_CLAIM_STATUS } from '~/features/business-account/config/claimStatus';
import {
  EDIT_BUSINESS_STATUS,
  MY_BUSINESS_PAGE_STATE,
} from '~/features/business-account/config/myBusinessPage';
import {
  resolveBusinessDisplayName,
  resolveEditBusinessStatus,
  resolveMyBusinessPageState,
} from '~/features/business-account/lib/businessPageState';

const readySummary = { isPending: false, isError: false };

describe('resolveMyBusinessPageState', () => {
  it('shows the pending notice while a claim is under review', () => {
    expect(
      resolveMyBusinessPageState({
        claimStatus: BUSINESS_CLAIM_STATUS.pending,
        placeId: 'place-1',
        summary: readySummary,
      }),
    ).toBe(MY_BUSINESS_PAGE_STATE.pending);
  });

  it('treats missing and rejected claims as not claimed', () => {
    for (const claimStatus of [null, BUSINESS_CLAIM_STATUS.rejected]) {
      expect(
        resolveMyBusinessPageState({ claimStatus, placeId: 'place-1', summary: readySummary }),
      ).toBe(MY_BUSINESS_PAGE_STATE.notClaimed);
    }
  });

  it('waits for a linked place when an approved business has none yet', () => {
    expect(
      resolveMyBusinessPageState({
        claimStatus: BUSINESS_CLAIM_STATUS.approved,
        placeId: null,
        summary: { isPending: true, isError: false },
      }),
    ).toBe(MY_BUSINESS_PAGE_STATE.noPlace);
  });

  it('reflects the place summary query for approved businesses', () => {
    const approved = { claimStatus: BUSINESS_CLAIM_STATUS.approved, placeId: 'place-1' };
    expect(
      resolveMyBusinessPageState({
        ...approved,
        summary: { isPending: false, isError: true },
      }),
    ).toBe(MY_BUSINESS_PAGE_STATE.error);
    expect(
      resolveMyBusinessPageState({
        ...approved,
        summary: { isPending: true, isError: false },
      }),
    ).toBe(MY_BUSINESS_PAGE_STATE.loading);
    expect(resolveMyBusinessPageState({ ...approved, summary: readySummary })).toBe(
      MY_BUSINESS_PAGE_STATE.page,
    );
  });
});

describe('resolveEditBusinessStatus', () => {
  const approved = {
    accountLoading: false,
    claimStatus: BUSINESS_CLAIM_STATUS.approved,
    profilePending: false,
    profileError: false,
  };

  it('waits for the account before deciding', () => {
    expect(resolveEditBusinessStatus({ ...approved, accountLoading: true })).toBe(
      EDIT_BUSINESS_STATUS.loading,
    );
  });

  it('locks editing until the claim is approved', () => {
    expect(
      resolveEditBusinessStatus({ ...approved, claimStatus: BUSINESS_CLAIM_STATUS.pending }),
    ).toBe(EDIT_BUSINESS_STATUS.locked);
    expect(resolveEditBusinessStatus({ ...approved, claimStatus: null })).toBe(
      EDIT_BUSINESS_STATUS.locked,
    );
  });

  it('reflects the business profile query once approved', () => {
    expect(resolveEditBusinessStatus({ ...approved, profileError: true })).toBe(
      EDIT_BUSINESS_STATUS.error,
    );
    expect(resolveEditBusinessStatus({ ...approved, profilePending: true })).toBe(
      EDIT_BUSINESS_STATUS.loading,
    );
    expect(resolveEditBusinessStatus(approved)).toBe(EDIT_BUSINESS_STATUS.ready);
  });
});

describe('resolveBusinessDisplayName', () => {
  it('prefers the explicit business name', () => {
    expect(
      resolveBusinessDisplayName({
        businessName: 'Acme',
        kind: ACCOUNT_KIND.converted,
        displayName: 'Jane',
      }),
    ).toBe('Acme');
  });

  it('uses the display name only for business-only accounts', () => {
    expect(
      resolveBusinessDisplayName({
        businessName: null,
        kind: ACCOUNT_KIND.businessOnly,
        displayName: 'Acme Coffee',
      }),
    ).toBe('Acme Coffee');
    expect(
      resolveBusinessDisplayName({
        businessName: null,
        kind: ACCOUNT_KIND.converted,
        displayName: 'Jane',
      }),
    ).toBeNull();
  });
});
