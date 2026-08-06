import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { isWeb } from '~/shared/lib/ui/platform';
import { Theme } from '~/shared/theme/Theme';

const LOGO = require('@assets/truRexLogo.png');

const PULSE_MS = 780;
const PULSE_EASING = Easing.inOut(Easing.ease);

type Props = {
  fullScreen?: boolean;
};

const BrandBootLoader = ({ fullScreen = true }: Props) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: PULSE_MS, easing: PULSE_EASING }),
        withTiming(1, { duration: PULSE_MS, easing: PULSE_EASING }),
      ),
      -1,
      false,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.72, { duration: PULSE_MS, easing: PULSE_EASING }),
        withTiming(1, { duration: PULSE_MS, easing: PULSE_EASING }),
      ),
      -1,
      false,
    );
  }, [opacity, scale]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={[styles.root, fullScreen && styles.fullScreen]} accessibilityLabel="Loading">
      {isWeb ? (
        <Image
          source={LOGO}
          style={styles.logo}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
      ) : (
        <Animated.Image
          source={LOGO}
          style={[styles.logo, logoStyle]}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.background,
    width: '100%',
  },
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    zIndex: 9999,
    elevation: 9999,
  },
  logo: {
    width: 168,
    height: 52,
  },
});

export default BrandBootLoader;
