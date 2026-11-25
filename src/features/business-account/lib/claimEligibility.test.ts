import { describe, expect, it } from 'vitest';
import { ACCOUNT_KIND } from '~/features/business-account/config/accountKind';
import { BUSINESS_CLAIM_STATUS } from '~/features/business-account/config/claimStatus';
import {
  canClaimPlace,
  canStartBusinessClaim,
  isPlaceOwner,
  resolveProfileClaimEntry,
} from '~/features/business-account/lib/claimEligibility';

const openPlace = { business_owner_id: null, is_verified_business: false, my_claim_status: null };

describe('canStartBusinessClaim', () => {
  it('allows a claim when there is none or the last one was rejected', () => {
    expect(canStartBusinessClaim({ claimStatus: null, isReadOnly: false })).toBe(true);
    expect(
      canStartBusinessClaim({ claimStatus: BUSINESS_CLAIM_STATUS.rejected, isReadOnly: false }),
    ).toBe(true);
  });

  it('blocks a claim while one is pending or approved, or the account is read-only', () => {
    expect(
      canStartBusinessClaim({ claimStatus: BUSINESS_CLAIM_STATUS.pending, isReadOnly: false }),
    ).toBe(false);
    expect(
      canStartBusinessClaim({ claimStatus: BUSINESS_CLAIM_STATUS.approved, isReadOnly: false }),
    ).toBe(false);
    expect(canStartBusinessClaim({ claimStatus: null, isReadOnly: true })).toBe(false);
  });
});

describe('resolveProfileClaimEntry', () => {
  it('offers the profile claim only to business accounts that can claim', () => {
    expect(
      resolveProfileClaimEntry({
        kind: ACCOUNT_KIND.businessOnly,
        claimStatus: null,
        canStartClaim: true,
      }),
    ).toEqual({ showPending: false, showClaim: true });
    expect(
      resolveProfileClaimEntry({
        kind: ACCOUNT_KIND.regular,
        claimStatus: null,
        canStartClaim: true,
      }),
    ).toEqual({ showPending: false, showClaim: false });
    expect(
      resolveProfileClaimEntry({
        kind: ACCOUNT_KIND.converted,
        claimStatus: BUSINESS_CLAIM_STATUS.approved,
        canStartClaim: false,
      }),
    ).toEqual({ showPending: false, showClaim: false });
  });

  it('shows the pending notice instead of the claim while a claim is under review', () => {
    for (const kind of [ACCOUNT_KIND.regular, ACCOUNT_KIND.businessOnly]) {
      expect(
        resolveProfileClaimEntry({
          kind,
          claimStatus: BUSINESS_CLAIM_STATUS.pending,
          canStartClaim: false,
        }),
      ).toEqual({ showPending: true, showClaim: false });
    }
  });
});

describe('canClaimPlace', () => {
  it('allows claiming an unowned place', () => {
    expect(canClaimPlace({ canStartClaim: true, place: openPlace })).toBe(true);
    expect(
      canClaimPlace({ canStartClaim: true, place: { ...openPlace, my_claim_status: 'rejected' } }),
    ).toBe(true);
  });

  it('hides the claim when the user cannot start one', () => {
    expect(canClaimPlace({ canStartClaim: false, place: openPlace })).toBe(false);
  });

  it('hides the claim for owned or verified places', () => {
    expect(
      canClaimPlace({ canStartClaim: true, place: { ...openPlace, business_owner_id: 'user-2' } }),
    ).toBe(false);
    expect(
      canClaimPlace({ canStartClaim: true, place: { ...openPlace, is_verified_business: true } }),
    ).toBe(false);
  });

  it('hides the claim while the user already claimed this place', () => {
    expect(
      canClaimPlace({ canStartClaim: true, place: { ...openPlace, my_claim_status: 'pending' } }),
    ).toBe(false);
    expect(
      canClaimPlace({ canStartClaim: true, place: { ...openPlace, my_claim_status: 'approved' } }),
    ).toBe(false);
  });
});

describe('isPlaceOwner', () => {
  it('matches only when my business profile owns the place', () => {
    const owner = (id: string | null) => ({ business_owner_id: id });
    expect(isPlaceOwner({ businessProfileId: 'biz-1', place: owner('biz-1') })).toBe(true);
    expect(isPlaceOwner({ businessProfileId: 'biz-1', place: owner('biz-2') })).toBe(false);
    expect(isPlaceOwner({ businessProfileId: 'biz-1', place: owner(null) })).toBe(false);
    expect(isPlaceOwner({ businessProfileId: undefined, place: owner(null) })).toBe(false);
  });
});
