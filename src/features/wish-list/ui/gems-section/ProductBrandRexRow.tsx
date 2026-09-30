import React from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { User } from 'lucide-react-native';
import CategoryBadge from '~/features/gems/ui/uncollected-rex-row/CategoryBadge';
import IconMetaRow from '~/features/gems/ui/uncollected-rex-row/IconMetaRow';
import SignedStorageImage from '~/shared/ui/media/SignedStorageImage';
import { RexPhotoPlaceholder } from '~/shared/ui/media/RexPhotoPlaceholder';
import { REX_IMAGES_BUCKET } from '~/shared/config/app';
import { useCategoryIcon } from '~/shared/hooks/useActiveCategories';
import { PRODUCT_BRAND_CATEGORY_CODE } from '~/features/wish-list/config/rexBridge';
import type { ProductBrandRexRow as ProductBrandRexRowData } from '~/features/wish-list/api/types';

type Props = {
  item: ProductBrandRexRowData;
  onPress: () => void;
  onAddToWishList: () => void;
};

function authorMetaLabel(item: ProductBrandRexRowData): string {
  const name = item.author_display_name.trim() || 'Member';
  const handle = item.author_handle?.trim();
  return handle ? `${name} · @${handle}` : name;
}

function ProductBrandRexRow({ item, onPress, onAddToWishList }: Props) {
  const photoPath = item.photo_paths[0] ?? null;
  const categoryIcon = useCategoryIcon(PRODUCT_BRAND_CATEGORY_CODE);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={item.brand_name}
      className="mb-3 min-w-0 flex-row items-center gap-3 rounded-xl border border-border bg-card p-3 active:opacity-90"
    >
      <View className="h-12 w-12 shrink-0 overflow-hidden rounded-lg">
        {photoPath ? (
          <SignedStorageImage
            bucket={REX_IMAGES_BUCKET}
            storagePath={photoPath}
            className="h-full w-full"
            contentFit="cover"
            accessibilityLabel={item.brand_name}
          />
        ) : (
          <RexPhotoPlaceholder
            categoryIcon={categoryIcon}
            className="h-full w-full"
            emojiSize={20}
            accessibilityLabel={item.brand_name}
          />
        )}
      </View>

      <View className="min-w-0 flex-1 overflow-hidden">
        <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
          {item.brand_name}
        </Text>
        <CategoryBadge label="Product or Brand" />
        <IconMetaRow icon={User} text={authorMetaLabel(item)} />
      </View>

      <TouchableOpacity
        onPress={onAddToWishList}
        activeOpacity={0.7}
        className="shrink-0 rounded-lg border border-border px-2.5 py-1.5"
      >
        <Text className="text-[11px] font-medium text-foreground">Add to Wish List</Text>
      </TouchableOpacity>
    </Pressable>
  );
}

export default ProductBrandRexRow;
