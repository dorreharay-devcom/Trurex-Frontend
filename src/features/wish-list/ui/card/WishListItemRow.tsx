import React from 'react';
import { Pressable, Text, View } from 'react-native';
import SignedStorageImage from '~/shared/ui/media/SignedStorageImage';
import { RexPhotoPlaceholder } from '~/shared/ui/media/RexPhotoPlaceholder';
import { REX_IMAGES_BUCKET } from '~/shared/config/app';
import type { WishListItemRow as WishListItemRowData } from '~/features/wish-list/api/types';

const RETAIL_SHOPPING_PLACEHOLDER_ICON = '🛍️';

type Props = {
  item: WishListItemRowData;
  onPress: () => void;
  onTriedThis?: () => void;
};

function WishListItemRow({ item, onPress, onTriedThis }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-2xl border border-border bg-card p-3 active:opacity-90"
    >
      <View className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
        {item.photo_path ? (
          <SignedStorageImage
            bucket={REX_IMAGES_BUCKET}
            storagePath={item.photo_path}
            className="h-full w-full"
            contentFit="cover"
            skeletonUntilLoaded
            accessibilityLabel={item.brand_name}
          />
        ) : (
          <RexPhotoPlaceholder
            categoryIcon={RETAIL_SHOPPING_PLACEHOLDER_ICON}
            className="h-full w-full"
            accessibilityLabel={item.brand_name}
          />
        )}
      </View>

      <View className="min-w-0 flex-1">
        <Text className="font-display text-sm font-bold text-foreground" numberOfLines={1}>
          {item.brand_name}
        </Text>
        {item.product_name ? (
          <Text className="mt-0.5 text-xs text-muted-foreground" numberOfLines={1}>
            {item.product_name}
          </Text>
        ) : null}
      </View>

      {onTriedThis ? (
        <Pressable
          onPress={onTriedThis}
          className="shrink-0 items-center rounded-lg border border-border px-2.5 py-1.5 active:opacity-70"
        >
          <Text className="text-[11px] font-medium text-foreground">I&apos;ve tried it now</Text>
        </Pressable>
      ) : null}
    </Pressable>
  );
}

export default WishListItemRow;
