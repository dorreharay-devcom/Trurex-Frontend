import { describe, expect, it } from 'vitest';
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
  it('offers the profile claim to any user who can start one', () => {
    expect(resolveProfileClaimEntry({ claimStatus: null, canStartClaim: true })).toEqual({
      showPending: false,
      showClaim: true,
    });
    expect(
      resolveProfileClaimEntry({
        claimStatus: BUSINESS_CLAIM_STATUS.approved,
        canStartClaim: false,
      }),
    ).toEqual({ showPending: false, showClaim: false });
  });

  it('shows the pending notice instead of the claim while a claim is under review', () => {
    expect(
      resolveProfileClaimEntry({
        claimStatus: BUSINESS_CLAIM_STATUS.pending,
        canStartClaim: false,
      }),
    ).toEqual({ showPending: true, showClaim: false });
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
  it('matches only the approved owner of the place', () => {
    expect(isPlaceOwner({ userId: 'user-1', place: { business_owner_id: 'user-1' } })).toBe(true);
    expect(isPlaceOwner({ userId: 'user-1', place: { business_owner_id: 'user-2' } })).toBe(false);
    expect(isPlaceOwner({ userId: 'user-1', place: { business_owner_id: null } })).toBe(false);
    expect(isPlaceOwner({ userId: undefined, place: { business_owner_id: null } })).toBe(false);
  });
});
