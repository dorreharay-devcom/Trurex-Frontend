import React from 'react';
import {
  Animated as RNAnimated,
  Modal,
  View,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { OverlayModalProps } from '~/types/overlayModal';
import { KEYBOARD_BEHAVIOR_PADDING_OR_HEIGHT } from '~/shared/config/keyboard';
import { OVERLAY_MODAL_PLATFORM_PROPS } from '~/shared/config/modalProps';
import { ModalToastLayer } from '~/shared/ui/toast/ModalToastLayer';
import { isAndroid, isWeb } from '~/utils';
import { cn } from '~/utils/general';

export type { OverlayModalProps } from '~/types/overlayModal';

const styles = StyleSheet.create({
  overlayRoot: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
});

const webOverlayRoot: ViewStyle | undefined = isWeb
  ? ({ width: '100%', height: '100%', minHeight: '100%' } as ViewStyle)
  : undefined;

const androidElevation: ViewStyle | undefined = isAndroid ? { elevation: 12 } : undefined;

export const OverlayModal: React.FC<OverlayModalProps> = ({
  visible,
  onRequestClose,
  onDismiss,
  contentTranslateY,
  backdropBackground,
  children,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      {...OVERLAY_MODAL_PLATFORM_PROPS}
      onRequestClose={onRequestClose}
      onDismiss={onDismiss}
    >
      <View style={[styles.overlayRoot, webOverlayRoot]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close dialog"
          onPress={onRequestClose}
          style={[StyleSheet.absoluteFill, { zIndex: 60 }]}
        >
          <View
            pointerEvents="none"
            className={cn(isWeb && 'backdrop-blur-sm')}
            style={[StyleSheet.absoluteFill, { backgroundColor: backdropBackground }]}
          />
        </Pressable>

        <KeyboardAvoidingView
          behavior={KEYBOARD_BEHAVIOR_PADDING_OR_HEIGHT}
          pointerEvents="box-none"
          style={[StyleSheet.absoluteFillObject, { zIndex: 61 }]}
        >
          <RNAnimated.View
            style={{
              flex: 1,
              width: '100%',
              transform: [{ translateY: contentTranslateY }],
            }}
          >
            <View
              className="absolute inset-0 sm:inset-4 sm:top-8 flex flex-col overflow-hidden bg-card sm:rounded-2xl sm:shadow-elevated"
              style={[{ paddingTop: insets.top, paddingBottom: insets.bottom }, androidElevation]}
            >
              {children}
            </View>
          </RNAnimated.View>
        </KeyboardAvoidingView>
      </View>
      <ModalToastLayer />
    </Modal>
  );
};
