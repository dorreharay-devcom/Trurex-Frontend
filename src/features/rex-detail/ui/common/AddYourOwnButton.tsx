import React from 'react';
import { Text, Pressable } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';

function AddYourOwnButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Add your own rec for this place"
      className="h-12 w-full flex-row items-center justify-center gap-2 rounded-xl bg-primary px-4 active:bg-primary/90"
    >
      <Plus size={20} color={Theme.colors.primaryForeground} />
      <Text className="text-base font-semibold text-primary-foreground">
        Add your own rec for this place
      </Text>
    </Pressable>
  );
}

export default AddYourOwnButton;
