import React from 'react';
import { useRouter } from 'expo-router';
import { BadgeCheck, Store } from 'lucide-react-native';
import type { PlaceSummaryRow } from '~/features/business/types/placeSummary';
import { ACCOUNT_MODE } from '~/features/business-account/config/accountMode';
import { useAccountMode } from '~/features/business-account/hooks/useAccountMode';
import { useBusinessAccount } from '~/features/business-account/hooks/useBusinessAccount';
import { useBusinessClaimFlow } from '~/features/business-account/hooks/useBusinessClaimFlow';
import { canClaimPlace, isPlaceOwner } from '~/features/business-account/lib/claimEligibility';
import { toPlaceClaimTarget } from '~/features/business-account/lib/claimTarget';
import BusinessClaimSheet from '~/features/business-account/ui/claim/BusinessClaimSheet';
import { Routes } from '~/shared/config/routes';
import PrimaryActionButton from '~/shared/ui/primitives/PrimaryActionButton';

type Props = {
  summary: PlaceSummaryRow;
};

function PlaceClaimCta({ summary }: Props) {
  const router = useRouter();
  const { userId, canStartClaim } = useBusinessAccount();
  const { setMode } = useAccountMode();
  const flow = useBusinessClaimFlow();
  const target = toPlaceClaimTarget(summary.place_id, summary.place_name);
  const claimable = canClaimPlace({ canStartClaim, place: summary });
  const owned = isPlaceOwner({ userId, place: summary });

  const openMyBusinessPage = () => {
    setMode(ACCOUNT_MODE.business);
    router.push(Routes.MyBusinessPage);
  };

  return (
    <>
      {owned ? (
        <PrimaryActionButton icon={Store} label="Manage my business" onPress={openMyBusinessPage} />
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
