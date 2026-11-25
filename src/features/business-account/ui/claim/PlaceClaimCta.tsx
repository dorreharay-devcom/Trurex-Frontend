import React from 'react';
import { BadgeCheck, Store } from 'lucide-react-native';
import type { PlaceSummaryRow } from '~/features/business/types/placeSummary';
import { useAccountMode } from '~/features/business-account/hooks/useAccountMode';
import { useBusinessAccount } from '~/features/business-account/hooks/useBusinessAccount';
import { useBusinessClaimFlow } from '~/features/business-account/hooks/useBusinessClaimFlow';
import { useOpenMyBusinessPage } from '~/features/business-account/hooks/useOpenMyBusinessPage';
import { canClaimPlace, isPlaceOwner } from '~/features/business-account/lib/claimEligibility';
import { toPlaceClaimTarget } from '~/features/business-account/lib/claimTarget';
import BusinessClaimSheet from '~/features/business-account/ui/claim/BusinessClaimSheet';
import PrimaryActionButton from '~/shared/ui/primitives/PrimaryActionButton';

type Props = {
  summary: PlaceSummaryRow;
};

function PlaceClaimCta({ summary }: Props) {
  const { canStartClaim } = useBusinessAccount();
  const { businessProfileId } = useAccountMode();
  const openMyBusinessPage = useOpenMyBusinessPage();
  const flow = useBusinessClaimFlow();
  const target = toPlaceClaimTarget(summary.place_id, summary.place_name);
  const claimable = canClaimPlace({ canStartClaim, place: summary });
  const owned = isPlaceOwner({ businessProfileId, place: summary });

  return (
    <>
      {owned ? (
        <PrimaryActionButton
          icon={Store}
          label="Manage my business"
          onPress={() => void openMyBusinessPage()}
        />
      ) : null}
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
