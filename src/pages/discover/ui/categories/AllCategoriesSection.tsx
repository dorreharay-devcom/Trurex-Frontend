import React, { useState } from 'react';
import { View, Text } from 'react-native';
import CategoryGrid from '~/pages/discover/ui/categories/CategoryGrid';
import CategoryPillsRow from '~/pages/discover/ui/categories/CategoryPillsRow';
import PinHint from '~/pages/discover/ui/categories/PinHint';
import ShowAllToggle from '~/pages/discover/ui/categories/ShowAllToggle';
import type { Category } from '~/pages/discover/types';

type AllCategoriesSectionProps = {
  allCats: Category[];
  remainingCats: Category[];
  hasPinned: boolean;
  activeCategory: string;
  categoriesPending: boolean;
  isPinned: (cat: Category) => boolean;
  isTogglingPin: boolean;
  onSelectCategory: (code: string) => void;
  onTogglePin: (serverId: string, pinned: boolean) => void;
};

const AllCategoriesSection = ({
  allCats,
  remainingCats,
  hasPinned,
  activeCategory,
  categoriesPending,
  isPinned,
  isTogglingPin,
  onSelectCategory,
  onTogglePin,
}: AllCategoriesSectionProps) => {
  const [showAll, setShowAll] = useState(false);

  if (!categoriesPending && allCats.length === 0) {
    return null;
  }

  const showGrid = !hasPinned || showAll;

  return (
    <View className="mb-8 w-full">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-sm font-display font-semibold text-foreground">All Categories</Text>
        {!categoriesPending && hasPinned && (
          <ShowAllToggle
            showAll={showAll}
            total={allCats.length}
            onToggle={() => setShowAll((v) => !v)}
          />
        )}
      </View>

      {showGrid ? (
        <CategoryGrid
          cats={allCats}
          activeCategory={activeCategory}
          pending={categoriesPending}
          isPinned={isPinned}
          isTogglingPin={isTogglingPin}
          onSelectCategory={onSelectCategory}
          onTogglePin={onTogglePin}
        />
      ) : (
        <CategoryPillsRow
          cats={remainingCats}
          activeCategory={activeCategory}
          onSelectCategory={onSelectCategory}
        />
      )}

      {!hasPinned && !categoriesPending && <PinHint />}
    </View>
  );
};

export default AllCategoriesSection;
