import React from 'react';
import { View, Text, Modal, Pressable, ActivityIndicator } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { Theme } from '~/theme/Theme';
import { isWeb, webContainerStyle } from '~/utils';

type Props = {
  visible: boolean;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
};

export function DeleteRecommendationConfirmModal({
  visible,
  message,
  onCancel,
  onConfirm,
  isDeleting = false,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (!isDeleting) onCancel();
      }}
      accessibilityViewIsModal
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Dismiss"
        disabled={isDeleting}
        className={`flex-1 bg-black/50 ${isWeb ? 'items-center justify-center px-4' : 'justify-end'}`}
        onPress={onCancel}
      >
        <Pressable
          className={`border border-border bg-card pt-3 pb-8 ${isWeb ? 'w-full rounded-2xl' : 'rounded-t-2xl border-t-0'}`}
          style={isWeb ? { maxWidth: 400 } : undefined}
          onPress={() => {}}
        >
          <View style={webContainerStyle} className="px-4">
            <View className={`mb-4 items-center ${isWeb ? 'hidden' : ''}`}>
              <View className="h-1 w-10 rounded-full bg-muted-foreground/30" />
            </View>
            <View className="mb-4 h-12 w-12 items-center justify-center self-center rounded-full bg-destructive/10">
              <Trash2 size={22} color={Theme.colors.destructive} />
            </View>
            <Text className="mb-1 text-center font-display text-lg font-bold text-foreground">
              Delete recommendation?
            </Text>
            <Text className="mb-6 text-center text-sm leading-relaxed text-muted-foreground">
              {message}
            </Text>
            <View className="flex-row gap-3">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Cancel"
                disabled={isDeleting}
                onPress={onCancel}
                className="flex-1 items-center rounded-xl border border-border bg-muted/50 py-2.5 cursor-pointer transition-colors hover:bg-muted active:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-muted/50"
              >
                <Text className="text-sm font-semibold text-black">Cancel</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Delete recommendation"
                disabled={isDeleting}
                onPress={onConfirm}
                className="flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-destructive py-2.5 cursor-pointer transition-colors hover:bg-destructive/90 active:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-destructive"
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color={Theme.colors.white} />
                ) : (
                  <Text className="text-sm font-semibold text-white">Delete</Text>
                )}
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
