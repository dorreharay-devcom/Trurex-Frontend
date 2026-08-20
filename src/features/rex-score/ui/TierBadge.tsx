import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import type { RexScoreTier } from '~/features/rex-score/types/rexScoreTier';

const ICON_SIZE_PX = 14;

type Props = {
  tier: RexScoreTier;
  size?: 'icon' | 'pill';
  isTopTier?: boolean;
};

function TierBadge({ tier, size = 'pill', isTopTier = false }: Props) {
  const shimmer = useSharedValue(1);

  useEffect(() => {
    if (!isTopTier || size !== 'pill') return;
    shimmer.value = withRepeat(
      withSequence(withTiming(0.55, { duration: 900 }), withTiming(1, { duration: 900 })),
      -1,
      false,
    );
  }, [isTopTier, size, shimmer]);

  const shimmerStyle = useAnimatedStyle(() => ({ opacity: shimmer.value }));

  if (size === 'icon') {
    return (
      <Text style={{ fontSize: ICON_SIZE_PX, lineHeight: ICON_SIZE_PX + 2 }}>{tier.icon}</Text>
    );
  }

  return (
    <View
      className="flex-row items-center gap-1.5 rounded-full px-3 py-1.5"
      style={{
        backgroundColor: tier.badge_background,
        borderWidth: 1,
        borderColor: tier.border_color,
        shadowColor: tier.glow_color,
        shadowOpacity: 0.9,
        shadowRadius: isTopTier ? 10 : 6,
        shadowOffset: { width: 0, height: 0 },
        elevation: isTopTier ? 6 : 3,
      }}
    >
      <Animated.Text style={isTopTier ? [{ fontSize: 15 }, shimmerStyle] : { fontSize: 15 }}>
        {tier.icon}
      </Animated.Text>
      <Text className="text-xs font-bold" style={{ color: tier.text_color }}>
        {tier.label}
      </Text>
    </View>
  );
}

export default TierBadge;
