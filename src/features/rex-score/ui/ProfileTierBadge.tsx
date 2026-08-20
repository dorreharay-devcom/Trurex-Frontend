import React, { useState } from 'react';
import { Modal, Pressable, Text, type ViewStyle } from 'react-native';
import { X } from 'lucide-react-native';
import TierBadge from '~/features/rex-score/ui/TierBadge';
import type { RexScoreTier } from '~/features/rex-score/types/rexScoreTier';
import { Theme } from '~/shared/theme/Theme';
import { isWeb } from '~/shared/lib/ui/platform';

const webDefaultCursor = isWeb ? ({ cursor: 'default' } as unknown as ViewStyle) : undefined;

type Props = {
  tier: RexScoreTier;
  isTopTier: boolean;
  tappable: boolean;
};

function ProfileTierBadge({ tier, isTopTier, tappable }: Props) {
  const [showDetail, setShowDetail] = useState(false);

  if (!tappable) {
    return <TierBadge tier={tier} size="pill" isTopTier={isTopTier} />;
  }

  return (
    <>
      <Pressable
        onPress={() => setShowDetail(true)}
        accessibilityRole="button"
        accessibilityLabel={`${tier.label} tier`}
      >
        <TierBadge tier={tier} size="pill" isTopTier={isTopTier} />
      </Pressable>

      <Modal
        visible={showDetail}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDetail(false)}
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/50 px-8"
          onPress={() => setShowDetail(false)}
        >
          <Pressable
            onPress={() => {}}
            style={webDefaultCursor}
            className="w-full max-w-sm items-center gap-4 rounded-2xl bg-card px-6 py-8"
          >
            <Pressable
              onPress={() => setShowDetail(false)}
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={8}
              className="absolute right-3 top-3 rounded-lg p-1.5 active:bg-muted/30"
            >
              <X size={16} color={Theme.colors.secondaryText} />
            </Pressable>

            {tier.description ? (
              <Text className="text-center text-base font-semibold text-foreground">
                {tier.description}
              </Text>
            ) : null}

            <TierBadge tier={tier} size="pill" isTopTier={isTopTier} />

            {tier.next_tier_hint ? (
              <Text className="text-center text-xs text-muted-foreground">
                {tier.next_tier_hint}
              </Text>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

export default ProfileTierBadge;
