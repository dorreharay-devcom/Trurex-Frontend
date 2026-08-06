import React from 'react';
import { Animated, Modal, View, KeyboardAvoidingView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { OverlayModalProps } from '~/shared/types/overlayModal';
import { KEYBOARD_BEHAVIOR_PADDING_OR_HEIGHT } from '~/shared/config/keyboard';
import { modalConfig, OVERLAY_MODAL_PLATFORM_PROPS } from '~/shared/config/overlaySheet';
import { ModalToastLayer } from '~/shared/ui/toast/ModalToastLayer';
import { isWeb } from '~/shared/lib/ui/platform';
import { androidElevation, cn } from '~/shared/lib/ui/styles';

export type { OverlayModalProps } from '~/shared/types/overlayModal';

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    ...(isWeb ? { width: '100%', height: '100%', minHeight: '100%' } : null),
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 60,
  },
  sheetLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 61,
  },
  sheetMotion: {
    flex: 1,
    width: '100%',
  },
});

export function OverlayModal({
  visible = true,
  embedded = false,
  onRequestClose,
  onDismiss,
  contentTranslateY,
  backdropBackground = modalConfig.layout.backdropBackground,
  children,
}: OverlayModalProps) {
  const insets = useSafeAreaInsets();

  const body = (
    <View style={styles.root}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close dialog"
        onPress={onRequestClose}
        style={[styles.backdrop, { backgroundColor: backdropBackground }]}
        className={cn(isWeb && 'backdrop-blur-sm')}
      />

      <KeyboardAvoidingView
        behavior={KEYBOARD_BEHAVIOR_PADDING_OR_HEIGHT}
        pointerEvents="box-none"
        style={styles.sheetLayer}
      >
        <Animated.View
          style={[styles.sheetMotion, { transform: [{ translateY: contentTranslateY }] }]}
        >
          <View
            className="absolute inset-0 flex-col overflow-hidden bg-card sm:inset-4 sm:top-8 sm:rounded-2xl sm:shadow-elevated"
            style={[{ paddingTop: insets.top, paddingBottom: insets.bottom }, androidElevation(12)]}
          >
            {children}
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
      <ModalToastLayer />
    </View>
  );

  if (embedded) {
    return body;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      {...OVERLAY_MODAL_PLATFORM_PROPS}
      onRequestClose={onRequestClose}
      onDismiss={onDismiss}
    >
      {body}
    </Modal>
  );
}
