import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { WishListItemPageState } from '~/pages/wish-list-item/hooks/useWishListItemPage';

type Props = { page: WishListItemPageState; onGoToGems: () => void };

function WishListItemPageBody({ page, onGoToGems }: Props) {
  if (!page.ready) return <View className="flex-1" />;

  if (page.item == null) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-center text-foreground mb-4">Item not found.</Text>
        <Pressable onPress={onGoToGems} className="rounded-lg bg-primary px-4 py-2">
          <Text className="font-semibold text-primary-foreground">Go to Gems</Text>
        </Pressable>
      </View>
    );
  }

  return <View className="flex-1" />;
}

export default WishListItemPageBody;
