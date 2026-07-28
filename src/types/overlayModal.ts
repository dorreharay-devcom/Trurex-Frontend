import type { Animated } from 'react-native';
import type { ReactNode } from 'react';

export type OverlayModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  onDismiss?: () => void;
  contentTranslateY: Animated.Value;
  backdropBackground: string;
  children: ReactNode;
  cardWidth?: number;
  cardHeight?: number;
  borderRadius?: number;
  contentPadding?: number;
};
