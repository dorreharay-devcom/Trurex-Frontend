import { describe, expect, it } from 'vitest';
import { BUSINESS_CLAIM_STATUS } from '~/features/business-account/config/claimStatus';
import { toBusinessProfile } from '~/features/business-account/lib/businessProfileRow';

describe('toBusinessProfile', () => {
  it('maps the first row of the RPC payload', () => {
    expect(
      toBusinessProfile([
        {
          is_business_account: true,
          business_claim_status: 'approved',
          business_description: 'Great coffee',
          business_photo_path: 'user-1/business-1.jpg',
          business_name: 'Acme',
          business_place_id: 'place-1',
          place_name: 'Acme Coffee',
          normalized_address: '1 Main St',
        },
      ]),
    ).toEqual({
      isBusinessAccount: true,
      claimStatus: BUSINESS_CLAIM_STATUS.approved,
      businessName: 'Acme',
      description: 'Great coffee',
      photoPath: 'user-1/business-1.jpg',
      placeId: 'place-1',
      placeName: 'Acme Coffee',
      address: '1 Main St',
    });
  });

  it('defaults missing or invalid fields', () => {
    expect(
      toBusinessProfile({ business_claim_status: 'weird', business_description: '  ' }),
    ).toEqual({
      isBusinessAccount: false,
      claimStatus: null,
      businessName: null,
      description: null,
      photoPath: null,
      placeId: null,
      placeName: null,
      address: null,
    });
    expect(toBusinessProfile(null).isBusinessAccount).toBe(false);
  });
});
