import React, { type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { ModalToastLayer } from '~/shared/ui/toast/ModalToastLayer';
import { ConfirmModalCard } from '~/shared/ui/destructive-confirm/ConfirmModalCard';
import { isWeb } from '~/shared/lib/ui/platform';
import { cn } from '~/shared/lib/ui/styles';
import { OVERLAY_MODAL_PLATFORM_PROPS } from '~/shared/config/overlaySheet';

export type DestructiveActionConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  icon?: ReactNode;
  pending?: boolean;
  inline?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DestructiveActionConfirmModal({
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
  if (!visible) return null;

  const content = (
    <View className={cn('flex-1', isWeb ? 'items-center justify-center px-4' : 'justify-end')}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Dismiss"
        disabled={pending}
        className="absolute bottom-0 left-0 right-0 top-0 bg-black/50"
        onPress={onCancel}
      />
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
      <ModalToastLayer />
    </View>
  );

  if (inline) {
    return <View style={styles.inlineRoot}>{content}</View>;
  }

  return (
    <Modal
      visible
      transparent
      animationType={isWeb ? 'fade' : 'slide'}
      {...OVERLAY_MODAL_PLATFORM_PROPS}
      onRequestClose={() => {
        if (!pending) onCancel();
      }}
      accessibilityViewIsModal
    >
      {content}
    </Modal>
  );
}

const styles = StyleSheet.create({
  inlineRoot: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2000,
    elevation: 2000,
  },
});
