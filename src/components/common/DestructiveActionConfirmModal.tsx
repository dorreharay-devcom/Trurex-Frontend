import React, { type ReactNode } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { isWeb, webContainerStyle } from '~/utils';
import { Theme } from '~/theme/Theme';
import { ModalToastLayer } from '~/components/toast/ModalToastLayer';

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
  const content = (
    <View className={`flex-1 ${isWeb ? 'items-center justify-center px-4' : 'justify-end'}`}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Dismiss"
        disabled={pending}
        className="absolute bottom-0 left-0 right-0 top-0 bg-black/50"
        onPress={onCancel}
      />
      <View
        className={`border border-border bg-card pt-3 pb-8 ${isWeb ? 'w-full rounded-2xl' : 'rounded-t-2xl border-t-0'}`}
        style={isWeb ? { maxWidth: 400 } : undefined}
      >
        <View style={webContainerStyle} className="px-4">
          <View className={`mb-4 items-center ${isWeb ? 'hidden' : ''}`}>
            <View className="h-1 w-10 rounded-full bg-muted-foreground/30" />
          </View>
          <View className="mb-4 h-12 w-12 items-center justify-center self-center rounded-full bg-destructive/10">
            {icon ?? <Trash2 size={22} color={Theme.colors.destructive} />}
          </View>
          <Text className="mb-1 text-center font-display text-lg font-bold text-foreground">
            {title}
          </Text>
          <Text className="mb-6 text-center text-sm leading-relaxed text-muted-foreground">
            {message}
          </Text>
          <View className="flex-row gap-3">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cancel"
              disabled={pending}
              onPress={onCancel}
              className="flex-1 items-center rounded-xl border border-border bg-muted/50 py-2.5 cursor-pointer transition-colors hover:bg-muted active:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-muted/50"
            >
              <Text className="text-sm font-semibold text-black">{cancelLabel}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={confirmLabel}
              disabled={pending}
              onPress={onConfirm}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-destructive py-2.5 cursor-pointer transition-colors hover:bg-destructive/90 active:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-destructive"
            >
              {pending ? (
                <ActivityIndicator size="small" color={Theme.colors.white} />
              ) : (
                <Text className="text-sm font-semibold text-white">{confirmLabel}</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
      <ModalToastLayer />
    </View>
  );

  if (!visible) return null;

  if (inline) {
    return <View style={styles.inlineRoot}>{content}</View>;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isWeb ? 'fade' : 'slide'}
      presentationStyle={Platform.OS === 'ios' ? 'overFullScreen' : undefined}
      statusBarTranslucent={Platform.OS === 'android'}
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
