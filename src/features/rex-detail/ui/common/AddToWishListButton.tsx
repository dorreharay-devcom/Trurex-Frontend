import React from 'react';
import { Text, Pressable } from 'react-native';
import { Gift } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';

function AddToWishListButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Add this product to my Wish List"
      className="h-12 w-full flex-row items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 active:bg-muted"
    >
      <Gift size={20} color={Theme.colors.foreground} />
      <Text className="text-base font-semibold text-foreground">
        Add this product to my Wish List
      </Text>
    </Pressable>
  );
}

export default AddToWishListButton;
