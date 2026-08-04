import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  confirmLabel: string;
  cancelLabel: string;
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmModalActions({
  confirmLabel,
  cancelLabel,
  pending,
  onCancel,
  onConfirm,
}: Props) {
  return (
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
  );
}
