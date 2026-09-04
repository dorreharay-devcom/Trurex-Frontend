import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { isWeb } from '~/shared/lib/ui/platform';
import CategoryGridItem from '~/features/discover/ui/categories/CategoryGridItem';
import CategoryGridSkeleton from '~/features/discover/ui/categories/CategoryGridSkeleton';
import type { Category } from '~/features/discover/types';

function gridColumnCount(screenWidth: number): number {
  if (!isWeb) return 3;
  if (screenWidth >= 1024) return 5;
  if (screenWidth >= 640) return 4;
  return 3;
}

type CategoryGridProps = {
  cats: Category[];
  activeCategory: readonly string[];
  pending: boolean;
  isPinned: (cat: Category) => boolean;
  isTogglingPin: boolean;
  onSelectCategory: (code: string) => void;
  onTogglePin: (serverId: string, pinned: boolean) => void;
};

const CategoryGrid = ({
  cats,
  activeCategory,
  pending,
  isPinned,
  isTogglingPin,
  onSelectCategory,
  onTogglePin,
}: CategoryGridProps) => {
  const { width: screenWidth } = useWindowDimensions();
  const colCount = gridColumnCount(screenWidth);
  const itemPct = `${(100 / colCount).toFixed(4)}%` as `${number}%`;

  if (pending && cats.length === 0) {
    return <CategoryGridSkeleton itemPct={itemPct} count={colCount * 2} />;
  }

  return (
    <View className="w-full flex-row flex-wrap">
      {cats.map((cat) => (
        <CategoryGridItem
          key={cat.id}
          cat={cat}
          isActive={activeCategory.includes(cat.code)}
          pinned={isPinned(cat)}
          pinDisabled={!cat.serverId || isTogglingPin}
          itemPct={itemPct}
          onSelect={onSelectCategory}
          onTogglePin={onTogglePin}
        />
      ))}
    </View>
  );
};

export default CategoryGrid;
