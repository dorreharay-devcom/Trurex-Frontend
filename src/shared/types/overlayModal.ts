import type { ReactNode } from 'react';
import type { Animated } from 'react-native';

export type OverlayModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  onDismiss?: () => void;
  contentTranslateY: Animated.Value;
  backdropBackground?: string;
  children: ReactNode;
};
