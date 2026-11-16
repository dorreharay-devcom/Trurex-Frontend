import React from 'react';
import { BadgeCheck } from 'lucide-react-native';
import type { PlaceSummaryRow } from '~/features/business/types/placeSummary';
import { useBusinessAccount } from '~/features/business-account/hooks/useBusinessAccount';
import { useBusinessClaimFlow } from '~/features/business-account/hooks/useBusinessClaimFlow';
import { canClaimPlace } from '~/features/business-account/lib/claimEligibility';
import { toPlaceClaimTarget } from '~/features/business-account/lib/claimTarget';
import BusinessClaimSheet from '~/features/business-account/ui/claim/BusinessClaimSheet';
import PrimaryActionButton from '~/shared/ui/primitives/PrimaryActionButton';

type Props = {
  summary: PlaceSummaryRow;
};

function PlaceClaimCta({ summary }: Props) {
  const { canStartClaim } = useBusinessAccount();
  const flow = useBusinessClaimFlow();
  const target = toPlaceClaimTarget(summary.place_id, summary.place_name);
  const claimable = canClaimPlace({ canStartClaim, place: summary });

  return (
    <>
      {claimable && target ? (
        <PrimaryActionButton
          icon={BadgeCheck}
          label="Claim this business"
          onPress={() => flow.start({ kind: 'place', target })}
        />
      ) : null}
      <BusinessClaimSheet flow={flow} />
    </>
  );
}

export default PlaceClaimCta;
