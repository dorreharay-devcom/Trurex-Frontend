import React from 'react';
import { View } from 'react-native';
import { useBusinessAccount } from '~/features/business-account/hooks/useBusinessAccount';
import { useBusinessClaimFlow } from '~/features/business-account/hooks/useBusinessClaimFlow';
import { resolveProfileClaimEntry } from '~/features/business-account/lib/claimEligibility';
import BusinessClaimPendingNotice from '~/features/business-account/ui/claim/BusinessClaimPendingNotice';
import BusinessClaimSheet from '~/features/business-account/ui/claim/BusinessClaimSheet';
import BusinessCtaRow from '~/features/business-account/ui/common/BusinessCtaRow';

function BusinessClaimProfileEntry() {
  const { kind, claimStatus, canStartClaim } = useBusinessAccount();
  const flow = useBusinessClaimFlow();
  const entry = resolveProfileClaimEntry({ kind, claimStatus, canStartClaim });

  return (
    <>
      {entry.showPending ? (
        <View className="px-4 pb-1 pt-3">
          <BusinessClaimPendingNotice />
        </View>
      ) : null}
      {entry.showClaim ? (
        <View className="px-4 pb-1 pt-3">
          <BusinessCtaRow
            title="Own a business?"
            subtitle="Claim it and get verified"
            actionLabel="Claim"
            onPress={() => flow.start()}
          />
        </View>
      ) : null}
      <BusinessClaimSheet flow={flow} />
    </>
  );
}

export default BusinessClaimProfileEntry;
