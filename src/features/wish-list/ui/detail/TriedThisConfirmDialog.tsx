import React from 'react';
import { ActivityIndicator, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { Star, X } from 'lucide-react-native';
import BottomSheet from '~/shared/ui/overlay/BottomSheet';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  visible: boolean;
  onYes: () => void;
  onNo: () => void;
  onClose: () => void;
  pending?: boolean;
};

function TriedThisConfirmDialog({ visible, onYes, onNo, onClose, pending = false }: Props) {
  return (
    <BottomSheet open={visible} onClose={onClose}>
      <View className="flex-row justify-end px-2 pt-1">
        <Pressable
          onPress={onClose}
          className="h-10 w-10 shrink-0 items-center justify-center rounded-lg active:opacity-70"
          hitSlop={8}
          accessibilityLabel="Close dialog"
        >
          <X size={20} color={Theme.colors.secondaryText} />
        </Pressable>
      </View>
      <View className="gap-5 px-5 pb-8 pt-1">
        <View className="h-12 w-12 items-center justify-center self-center rounded-full bg-primary/10">
          <Star size={22} color={Theme.colors.primary} />
        </View>
        <Text className="text-center font-display text-lg font-bold text-foreground">
          Did you want to write a Rex about it?
        </Text>
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={onNo}
            disabled={pending}
            activeOpacity={0.85}
            className="flex-1 items-center rounded-xl border border-border bg-muted/50 py-2.5"
          >
            <Text className="text-sm font-semibold text-foreground">No</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onYes}
            disabled={pending}
            activeOpacity={0.85}
            className="flex-1 items-center justify-center rounded-xl bg-primary py-2.5"
          >
            {pending ? (
              <ActivityIndicator size="small" color={Theme.colors.background} />
            ) : (
              <Text className="text-sm font-semibold text-primary-foreground">Yes</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
}

export default TriedThisConfirmDialog;
