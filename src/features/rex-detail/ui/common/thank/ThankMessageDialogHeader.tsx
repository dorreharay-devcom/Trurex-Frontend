import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Gift, X } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  onClose: () => void;
};

function ThankMessageDialogHeader({ onClose }: Props) {
  return (
    <View className="flex-row items-center justify-between px-4 pb-3 pt-3">
      <View className="min-w-0 flex-1 flex-row items-center gap-2 pr-2">
        <Gift size={20} color={Theme.colors.secondaryText} />
        <Text className="text-lg font-semibold text-foreground" numberOfLines={2}>
          Send a thank you
        </Text>
      </View>
      <Pressable
        onPress={onClose}
        className="h-10 w-10 shrink-0 items-center justify-center rounded-lg active:opacity-70"
        hitSlop={8}
        accessibilityLabel="Close thank you dialog"
      >
        <X size={20} color={Theme.colors.secondaryText} />
      </Pressable>
    </View>
  );
}

export default ThankMessageDialogHeader;
