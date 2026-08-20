import React from 'react';
import { Animated, Modal, Pressable, StyleSheet, View } from 'react-native';
import { OVERLAY_MODAL_PLATFORM_PROPS } from '~/shared/config/overlaySheet';
import { useSheetSpringAnimation } from '~/shared/hooks/useSheetSpringAnimation';
import { isWeb } from '~/shared/lib/ui/platform';
import type { DestructiveActionConfirmModalProps } from '~/shared/types/destructiveActionConfirmModal';
import { ConfirmModalCard } from '~/shared/ui/destructive-confirm/ConfirmModalCard';
import { ModalToastLayer } from '~/shared/ui/toast/ModalToastLayer';

function DestructiveActionConfirmModal({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  icon,
  pending = false,
  inline = false,
  onCancel,
  onConfirm,
}: DestructiveActionConfirmModalProps) {
  const {
    visible: modalVisible,
    backdropOpacity,
    sheetTranslateY,
  } = useSheetSpringAnimation(visible);

  const dismiss = () => {
    if (!pending) onCancel();
  };

  const sheet = (
    <Animated.View
      style={[
        styles.sheet,
        isWeb && styles.sheetWeb,
        { transform: [{ translateY: sheetTranslateY }] },
      ]}
    >
      <ConfirmModalCard
        title={title}
        message={message}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
        icon={icon}
        pending={pending}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    </Animated.View>
  );

  const backdrop = (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: backdropOpacity }]}
      pointerEvents="box-none"
    >
      <Pressable
        style={StyleSheet.absoluteFill}
        disabled={pending}
        onPress={dismiss}
        accessibilityRole="button"
        accessibilityLabel="Dismiss"
      />
    </Animated.View>
  );

  if (inline) {
    if (!visible && !modalVisible) return null;
    return (
      <View style={styles.inlineRoot} pointerEvents="box-none">
        {backdrop}
        <View style={styles.overlay} pointerEvents="box-none">
          {sheet}
        </View>
        <ModalToastLayer />
      </View>
    );
  }

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      {...OVERLAY_MODAL_PLATFORM_PROPS}
      onRequestClose={dismiss}
      accessibilityViewIsModal
    >
      {backdrop}
      <View style={styles.overlay} pointerEvents="box-none">
        {sheet}
      </View>
      <ModalToastLayer />
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0,0,0,0.5)' },
  overlay: {
    flex: 1,
    justifyContent: isWeb ? 'center' : 'flex-end',
    alignItems: 'center',
    paddingHorizontal: isWeb ? 16 : 0,
  },
  sheet: {
    width: '100%',
  },
  sheetWeb: {
    maxWidth: 400,
  },
  inlineRoot: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2000,
    elevation: 2000,
  },
});

export default DestructiveActionConfirmModal;
