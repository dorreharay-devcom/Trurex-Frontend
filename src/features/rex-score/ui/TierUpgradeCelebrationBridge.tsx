import React from 'react';
import { useAuth } from '~/features/auth/providers';
import { useAccountMode } from '~/features/business-account/hooks/useAccountMode';
import { useTierUpgradeCelebration } from '~/features/rex-score/hooks/useTierUpgradeCelebration';
import TierUpgradeCelebrationOverlay from '~/features/rex-score/ui/TierUpgradeCelebrationOverlay';

const TierUpgradeCelebrationBridge = () => {
  const { mfaPending, booting } = useAuth();
  const { activeProfileId } = useAccountMode();
  const userId = !booting && !mfaPending ? activeProfileId : null;
  const celebration = useTierUpgradeCelebration(userId);

  return (
    <TierUpgradeCelebrationOverlay
      tier={celebration.tier}
      isTopTier={celebration.isTopTier}
      onDismiss={celebration.dismiss}
    />
  );
};

export default TierUpgradeCelebrationBridge;
