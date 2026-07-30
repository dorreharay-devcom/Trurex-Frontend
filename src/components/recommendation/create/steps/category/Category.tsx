import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  FlatList,
  useWindowDimensions,
  Text,
  ActivityIndicator,
  type LayoutChangeEvent,
} from 'react-native';
import { CREATE_REC_STEP_INNER } from '~/constants/recommendation/createLayout';
import { categoryRowToPickerTile } from '~/constants/recommendation/rexCategories';
import { useActiveCategories } from '~/hooks/useActiveCategories';
import { Theme } from '~/shared/theme/Theme';
import { getCategoryGridConfig } from '~/utils/recommendation/recCategoryNav';
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
  const [listRowWidth, setListRowWidth] = useState<number | null>(null);

  const onGridLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setListRowWidth((prev) => (Math.abs((prev ?? 0) - w) > 0.5 ? w : prev));
  }, []);

  const resolvedColumnWidth = useMemo(() => {
    if (listRowWidth == null || listRowWidth <= 0) return grid.tileWidth;
    const cols = grid.numColumns;
    const g = grid.gap;
    return (listRowWidth - g * (cols - 1)) / cols;
  }, [grid.gap, grid.numColumns, grid.tileWidth, listRowWidth]);

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
      <View className="flex-1" onLayout={onGridLayout}>
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
          renderItem={({ item, index }) => {
            const remainder = tiles.length % grid.numColumns;
            const isOnlyTileOnIncompleteLastRow = remainder === 1 && index === tiles.length - 1;

            const tile = (
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
                preventStretch={isOnlyTileOnIncompleteLastRow}
                resolvedColumnWidth={
                  isOnlyTileOnIncompleteLastRow ? resolvedColumnWidth : undefined
                }
              />
            );

            if (isOnlyTileOnIncompleteLastRow) {
              return (
                <View className="min-w-0 flex-1 flex-row items-stretch justify-center">{tile}</View>
              );
            }

            return tile;
          }}
        />
      </View>
    </View>
  );
};
