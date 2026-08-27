import React, { useCallback } from 'react';
import { Pressable, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useThankRex } from '~/features/rex-detail/hooks/useThankRex';
import ThankMessageSheet from '~/features/rex-detail/ui/common/ThankMessageSheet';

type Props = {
  rexId: string;
  initialThanked: boolean;
};

function ThankRexButton({ rexId, initialThanked }: Props) {
  const { thanked, sheetOpen, openSheet, closeSheet, sendThank } = useThankRex(
    rexId,
    initialThanked,
  );
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    if (thanked) return;
    openSheet();
  }, [thanked, openSheet]);

  const handleSelect = useCallback(
    (message: string) => {
      scale.value = withSequence(
        withTiming(1.2, { duration: 100 }),
        withSpring(1, { damping: 6, stiffness: 180 }),
      );
      void sendThank(message);
    },
    [sendThank, scale],
  );

  return (
    <>
      <Animated.View style={animatedStyle}>
        <Pressable
          onPress={handlePress}
          disabled={thanked}
          accessibilityRole="button"
          accessibilityLabel={thanked ? 'You thanked this rex' : 'Send a thank you'}
          className="flex-row items-center gap-1 rounded-full bg-rating-star px-2.5 py-1.5 active:opacity-90"
        >
          <Text className="text-sm leading-none">👏</Text>
          <Text className="text-xs font-semibold text-white">
            {thanked ? 'Thanked' : 'Send a thank'}
          </Text>
        </Pressable>
      </Animated.View>

      <ThankMessageSheet open={sheetOpen} onClose={closeSheet} onSelect={handleSelect} />
    </>
  );
}

export default ThankRexButton;
