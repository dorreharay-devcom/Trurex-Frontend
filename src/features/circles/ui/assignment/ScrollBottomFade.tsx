import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '~/shared/theme/Theme';

type Props = { visible: boolean };

const ScrollBottomFade = ({ visible }: Props) => {
  if (!visible) return null;
  return (
    <LinearGradient
      pointerEvents="none"
      colors={[Theme.colors.transparent, Theme.colors.card]}
      style={styles.fade}
    />
  );
};

const styles = StyleSheet.create({
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 44,
  },
});

export default ScrollBottomFade;
