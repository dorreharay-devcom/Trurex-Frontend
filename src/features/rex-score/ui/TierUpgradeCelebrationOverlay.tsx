import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import GoldConfetti from '~/features/rex-score/ui/GoldConfetti';
import TierBadge from '~/features/rex-score/ui/TierBadge';
import type { RexScoreTier } from '~/features/rex-score/types/rexScoreTier';
import { cn } from '~/shared/lib/ui/styles';

type Props = {
  tier: RexScoreTier | null;
  isTopTier: boolean;
  onDismiss: () => void;
};

const TierUpgradeCelebrationOverlay = ({ tier, isTopTier, onDismiss }: Props) => {
  if (!tier) return null;

  const foreground = isTopTier ? tier.text_color : '#FFFFFF';
  const subForeground = isTopTier ? 'rgba(212,175,55,0.85)' : 'rgba(255,255,255,0.85)';

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onDismiss}>
      <Pressable
        onPress={onDismiss}
        className={cn(
          'flex-1 items-center justify-center bg-black',
          !isTopTier && 'bg-black/60 px-8',
        )}
      >
        {isTopTier ? <GoldConfetti /> : null}
        <View className="items-center gap-4 px-8">
          <Text
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: foreground }}
          >
            Tier upgrade
          </Text>
          <TierBadge tier={tier} size="pill" isTopTier={isTopTier} />
          <Text className="text-center text-base font-semibold" style={{ color: foreground }}>
            You&apos;ve reached {tier.label}!
          </Text>
          {tier.description ? (
            <Text className="text-center text-sm" style={{ color: subForeground }}>
              {tier.description}
            </Text>
          ) : null}
        </View>
      </Pressable>
    </Modal>
  );
};

export default TierUpgradeCelebrationOverlay;
