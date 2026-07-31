import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { isWeb, webDisabledCursor } from '~/utils';
import { cn } from '~/utils/general';

type Props = {
  disabled: boolean;
  onPress: () => void;
};

function AddManualPlaceButton({ disabled, onPress }: Props) {
  const disabledCursor = webDisabledCursor(disabled);
  return (
    <View className={cn('mt-2 w-full', disabled && 'cursor-not-allowed')} style={disabledCursor}>
      <Pressable
        onPress={() => {
          if (disabled) return;
          onPress();
        }}
        disabled={disabled && !isWeb}
        accessibilityState={{ disabled }}
        style={disabledCursor}
        className={cn(
          'w-full flex-row items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-transparent p-4',
          disabled
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer active:border-primary/40 active:opacity-90',
        )}
        accessibilityRole="button"
        accessibilityLabel="Add a new place manually"
      >
        <Plus size={20} color={Theme.colors.secondaryText} />
        <Text className="text-base font-medium text-muted-foreground">
          Add a new place manually
        </Text>
      </Pressable>
    </View>
  );
}

export default AddManualPlaceButton;
