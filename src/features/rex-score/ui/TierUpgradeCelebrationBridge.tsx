import React from 'react';
import { useAuth } from '~/features/auth/providers';
import { useTierUpgradeCelebration } from '~/features/rex-score/hooks/useTierUpgradeCelebration';
import TierUpgradeCelebrationOverlay from '~/features/rex-score/ui/TierUpgradeCelebrationOverlay';

const TierUpgradeCelebrationBridge = () => {
  const { user, mfaPending, booting } = useAuth();
  const userId = !booting && !mfaPending ? user?.id : null;
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
