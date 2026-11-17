import { parseBusinessClaimStatus } from '~/features/business-account/config/claimStatus';
import type { BusinessProfile } from '~/features/business-account/types/businessProfile';
import { firstNonEmptyString, firstRecord } from '~/shared/lib/data/guards';

export function toBusinessProfile(data: unknown): BusinessProfile {
  const row = firstRecord(data) ?? {};
  return {
    isBusinessAccount: row.is_business_account === true,
    claimStatus: parseBusinessClaimStatus(row.business_claim_status),
    businessName: firstNonEmptyString(row, 'business_name'),
    description: firstNonEmptyString(row, 'business_description'),
    photoPath: firstNonEmptyString(row, 'business_photo_path'),
    placeId: firstNonEmptyString(row, 'business_place_id'),
    placeName: firstNonEmptyString(row, 'place_name'),
    address: firstNonEmptyString(row, 'normalized_address'),
  };
}
