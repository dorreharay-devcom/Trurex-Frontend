import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Package, User } from 'lucide-react-native';
import CategoryBadge from '~/features/gems/ui/uncollected-rex-row/CategoryBadge';
import IconMetaRow from '~/features/gems/ui/uncollected-rex-row/IconMetaRow';
import SignedStorageImage from '~/shared/ui/media/SignedStorageImage';
import { REX_IMAGES_BUCKET } from '~/shared/config/app';
import { Theme } from '~/shared/theme/Theme';
import type { ProductBrandRexRow as ProductBrandRexRowData } from '~/features/wish-list/api/types';

type Props = {
  item: ProductBrandRexRowData;
  onPress: () => void;
};

function authorMetaLabel(item: ProductBrandRexRowData): string {
  const name = item.author_display_name.trim() || 'Member';
  const handle = item.author_handle?.trim();
  return handle ? `${name} · @${handle}` : name;
}

function ProductBrandRexRow({ item, onPress }: Props) {
  const photoPath = item.photo_paths[0] ?? null;

  return (
    <View className="mb-3 min-w-0 flex-row items-center gap-3 rounded-xl border border-border bg-card p-3">
      {photoPath ? (
        <View className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
          <SignedStorageImage
            bucket={REX_IMAGES_BUCKET}
            storagePath={photoPath}
            className="h-full w-full"
            contentFit="cover"
            accessibilityLabel={item.brand_name}
          />
        </View>
      ) : (
        <View className="h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Package size={18} color={Theme.colors.muted} />
        </View>
      )}

      <View className="min-w-0 flex-1 overflow-hidden">
        <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
          {item.brand_name}
        </Text>
        <CategoryBadge label="Product or Brand" />
        <IconMetaRow icon={User} text={authorMetaLabel(item)} />
      </View>

      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className="shrink-0 rounded-lg border border-border px-2.5 py-1.5"
      >
        <Text className="text-[11px] font-medium text-foreground">Add to Wish List</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ProductBrandRexRow;
