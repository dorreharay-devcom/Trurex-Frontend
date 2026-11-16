import type { BusinessClaimStatus } from '~/features/business-account/config/claimStatus';

export type BusinessProfile = {
  isBusinessAccount: boolean;
  claimStatus: BusinessClaimStatus | null;
  businessName: string | null;
  description: string | null;
  photoPath: string | null;
  placeId: string | null;
  placeName: string | null;
  address: string | null;
};

export type UpdateBusinessProfileInput = {
  p_description?: string;
  p_photo_path?: string;
};
