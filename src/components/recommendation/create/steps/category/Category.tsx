import React, { useMemo } from 'react';
import { View, FlatList, useWindowDimensions, Text, ActivityIndicator } from 'react-native';
import { CREATE_REC_STEP_INNER } from '~/constants/recommendation/createLayout';
import { categoryRowToPickerTile } from '~/constants/recommendation/rexCategories';
import { useActiveCategories } from '~/hooks/useActiveCategories';
import { Theme } from '~/theme/Theme';
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

  const { data, isLoading, isError } = useActiveCategories(true);
  const tiles = useMemo(() => (data ? data.map(categoryRowToPickerTile) : []), [data]);

  const autoSuggestedCat = useMemo(
    () =>
      autoSuggestedCategoryId ? tiles.find((c) => c.id === autoSuggestedCategoryId) : undefined,
    [autoSuggestedCategoryId, tiles],
  );

  if (isLoading && data == null) {
    return (
      <View className={cn(CREATE_REC_STEP_INNER, 'flex-1 items-center justify-center py-16')}>
        <ActivityIndicator color={Theme.colors.primary} />
        <Text className="mt-3 text-sm text-muted-foreground">Loading categories…</Text>
      </View>
    );
  }

  if (isError || tiles.length === 0) {
    return (
      <View className={cn(CREATE_REC_STEP_INNER, 'flex-1 items-center justify-center px-4 py-16')}>
        <Text className="text-center text-sm text-destructive">
          {isError
            ? 'Could not load categories. Check your connection and try again.'
            : 'No categories available.'}
        </Text>
      </View>
    );
  }

  return (
    <View className={cn(CREATE_REC_STEP_INNER, 'flex-1')}>
      <FlatList
        className="flex-1"
        key={grid.numColumns}
        data={tiles}
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
