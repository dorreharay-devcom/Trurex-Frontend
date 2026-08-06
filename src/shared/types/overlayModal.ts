import type { ReactNode } from 'react';
import type { Animated } from 'react-native';

export type OverlayModalProps = {
  visible?: boolean;
  /** When true, render sheet in-tree (route overlays) instead of RN Modal. */
  embedded?: boolean;
  onRequestClose: () => void;
  onDismiss?: () => void;
  contentTranslateY: Animated.Value;
  backdropBackground?: string;
  children: ReactNode;
};
