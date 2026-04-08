import React, { useMemo } from 'react';
import { View, FlatList, useWindowDimensions } from 'react-native';
import { CREATE_REC_STEP_INNER } from '~/constants/recommendation/createLayout';
import { REX_CATEGORIES } from '~/constants/recommendation/rexCategories';
import { getCategoryGridConfig } from '~/utils/recommendation/categoryGridConfig';
import { cn } from '~/utils/general';
import { CategoryListHeader, CategoryTile } from './common';

type Props = {
  selectedCategoryId: string | null;
  onSelectCategory: (id: string) => void;
  autoSuggestedCategoryId: string | null;
};

export const Category: React.FC<Props> = ({
  selectedCategoryId,
  onSelectCategory,
  autoSuggestedCategoryId,
}) => {
  const { width } = useWindowDimensions();
  const grid = useMemo(() => getCategoryGridConfig(width), [width]);

  const autoSuggestedCat = useMemo(
    () =>
      autoSuggestedCategoryId
        ? REX_CATEGORIES.find((c) => c.id === autoSuggestedCategoryId)
        : undefined,
    [autoSuggestedCategoryId],
  );

  return (
    <View className={cn(CREATE_REC_STEP_INNER, 'flex-1')}>
      <FlatList
        className="flex-1"
        key={grid.numColumns}
        data={REX_CATEGORIES}
        keyExtractor={(item) => item.id}
        numColumns={grid.numColumns}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-36"
        columnWrapperStyle={{ gap: grid.gap, marginBottom: grid.gap }}
        ListHeaderComponent={
          <CategoryListHeader
            autoSuggestedCategoryId={autoSuggestedCategoryId}
            autoSuggestedCat={autoSuggestedCat}
          />
        }
        renderItem={({ item }) => (
          <CategoryTile
            grid={grid}
            cat={item}
            selected={selectedCategoryId === item.id}
            primaryAutoSuggested={
              selectedCategoryId === item.id &&
              autoSuggestedCategoryId !== null &&
              item.id === autoSuggestedCategoryId
            }
            onSelect={() => onSelectCategory(item.id)}
          />
        )}
      />
    </View>
  );
};
