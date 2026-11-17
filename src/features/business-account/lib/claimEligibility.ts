import {
  BUSINESS_CLAIM_STATUS,
  parseBusinessClaimStatus,
  type BusinessClaimStatus,
} from '~/features/business-account/config/claimStatus';
import type { PlaceSummaryRow } from '~/features/business/types/placeSummary';

type ClaimEligibilityInput = {
  claimStatus: BusinessClaimStatus | null;
  isReadOnly: boolean;
};

type PlaceClaimInput = {
  canStartClaim: boolean;
  place: Pick<PlaceSummaryRow, 'business_owner_id' | 'is_verified_business' | 'my_claim_status'>;
};

type PlaceOwnerInput = {
  userId: string | undefined;
  place: Pick<PlaceSummaryRow, 'business_owner_id'>;
};

type ProfileClaimEntryInput = {
  claimStatus: BusinessClaimStatus | null;
  canStartClaim: boolean;
};

export type ProfileClaimEntry = {
  showPending: boolean;
  showClaim: boolean;
};

function isOpenClaimStatus(status: BusinessClaimStatus | null): boolean {
  return status !== BUSINESS_CLAIM_STATUS.pending && status !== BUSINESS_CLAIM_STATUS.approved;
}

export function canStartBusinessClaim({ claimStatus, isReadOnly }: ClaimEligibilityInput): boolean {
  return !isReadOnly && isOpenClaimStatus(claimStatus);
}

export function resolveProfileClaimEntry({
  claimStatus,
  canStartClaim,
}: ProfileClaimEntryInput): ProfileClaimEntry {
  return {
    showPending: claimStatus === BUSINESS_CLAIM_STATUS.pending,
    showClaim: canStartClaim,
  };
}

export function canClaimPlace({ canStartClaim, place }: PlaceClaimInput): boolean {
  if (!canStartClaim) return false;
  if (place.is_verified_business || place.business_owner_id) return false;
  return isOpenClaimStatus(parseBusinessClaimStatus(place.my_claim_status));
}

export function isPlaceOwner({ userId, place }: PlaceOwnerInput): boolean {
  return userId != null && place.business_owner_id === userId;
}
