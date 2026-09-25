import React from 'react';
import { Pressable, Text, View } from 'react-native';
import SignedStorageImage from '~/shared/ui/media/SignedStorageImage';
import { RexPhotoPlaceholder } from '~/shared/ui/media/RexPhotoPlaceholder';
import { REX_IMAGES_BUCKET } from '~/shared/config/app';
import WishListTagRow from '~/features/wish-list/ui/card/WishListTagRow';
import type { WishListItemRow } from '~/features/wish-list/api/types';

export const WISH_LIST_CARD_WIDTH = 260;
const RETAIL_SHOPPING_PLACEHOLDER_ICON = '🛍️';

type Props = {
  item: WishListItemRow;
  onPress: () => void;
  onTriedThis?: () => void;
};

function WishListItemCard({ item, onPress, onTriedThis }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={{ width: WISH_LIST_CARD_WIDTH, flexShrink: 0 }}
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-card active:opacity-90"
    >
      <View className="aspect-[4/3] w-full">
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

      <View className="flex-1 justify-between gap-3 p-3">
        <View className="gap-3">
          <View>
            <Text className="font-display text-base font-bold text-foreground" numberOfLines={2}>
              {item.brand_name}
            </Text>
            {item.product_name ? (
              <Text className="mt-0.5 text-sm text-muted-foreground" numberOfLines={1}>
                {item.product_name}
              </Text>
            ) : null}
          </View>

          <WishListTagRow tags={item.tags} />
        </View>

        {onTriedThis ? (
          <Pressable
            onPress={onTriedThis}
            className="w-full items-center rounded-xl border border-border py-2.5 active:opacity-70"
          >
            <Text className="text-sm font-semibold text-foreground">I&apos;ve tried it now</Text>
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}

export default WishListItemCard;
