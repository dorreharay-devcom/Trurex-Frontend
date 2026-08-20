import React, { useEffect, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const PARTICLE_COUNT = 24;
const GOLD = '#D4AF37';

type Particle = {
  key: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
};

function buildParticles(windowWidth: number): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
    key: index,
    left: Math.random() * windowWidth,
    size: 6 + Math.random() * 6,
    delay: Math.random() * 400,
    duration: 1800 + Math.random() * 900,
    rotation: Math.random() * 360,
  }));
}

function ConfettiPiece({ particle }: { particle: Particle }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      particle.delay,
      withTiming(1, { duration: particle.duration, easing: Easing.out(Easing.quad) }),
    );
  }, [particle, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [
      { translateY: progress.value * 420 },
      { rotate: `${particle.rotation + progress.value * 260}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: -20,
          left: particle.left,
          width: particle.size,
          height: particle.size * 1.6,
          backgroundColor: GOLD,
          borderRadius: 2,
        },
        style,
      ]}
    />
  );
}

function GoldConfetti() {
  const { width: windowWidth } = useWindowDimensions();
  const particles = useMemo(() => buildParticles(windowWidth), [windowWidth]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      {particles.map((particle) => (
        <ConfettiPiece key={particle.key} particle={particle} />
      ))}
    </View>
  );
}

export default GoldConfetti;
