import React, { useMemo } from 'react';
import {
  View,
  FlatList,
  useWindowDimensions,
  Text,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { CREATE_REC_STEP_INNER } from '~/features/rex-create/config/layout';
import { categoryRowToPickerTile } from '~/features/rex-create/lib/categories';
import { useActiveCategories } from '~/shared/hooks/useActiveCategories';
import { useResolvedColumnWidth } from '~/features/rex-create/hooks/useResolvedColumnWidth';
import { Theme } from '~/shared/theme/Theme';
import { getCategoryGridConfig } from '~/features/rex-create/lib/categories';
import { cn } from '~/shared/lib/ui/styles';
import { CategoryListHeader, CategoryTile } from './common';

type Props = {
  selectedCategoryId: string | null;
  onSelectCategory: (id: string) => void;
  autoSuggestedCategoryId: string | null;
};

const CenteredStep = ({ children }: { children: React.ReactNode }) => (
  <View className={cn(CREATE_REC_STEP_INNER, 'flex-1 items-center justify-center px-4 py-16')}>
    {children}
  </View>
);

const Category: React.FC<Props> = ({
  selectedCategoryId,
  onSelectCategory,
  autoSuggestedCategoryId,
}) => {
  const { width } = useWindowDimensions();
  const grid = useMemo(() => getCategoryGridConfig(width), [width]);
  const { onGridLayout, resolvedColumnWidth } = useResolvedColumnWidth(grid);

  const { data, isLoading, isError, refetch } = useActiveCategories(true);
  const tiles = useMemo(() => (data ? data.map(categoryRowToPickerTile) : []), [data]);
  const suggestion = tiles.find((c) => c.id === autoSuggestedCategoryId);
  const loneTileIndex = tiles.length % grid.numColumns === 1 ? tiles.length - 1 : -1;

  if (isLoading) {
    return (
      <CenteredStep>
        <ActivityIndicator color={Theme.colors.primary} />
        <Text className="mt-3 text-sm text-muted-foreground">Loading categories…</Text>
      </CenteredStep>
    );
  }

  if (isError || tiles.length === 0) {
    return (
      <CenteredStep>
        <Text className="text-center text-sm text-destructive">
          {isError
            ? 'Could not load categories. Check your connection and try again.'
            : 'No categories available.'}
        </Text>
        {isError ? (
          <Pressable
            onPress={() => void refetch()}
            accessibilityRole="button"
            className="mt-4 rounded-xl border border-border bg-card px-4 py-2 active:opacity-90"
          >
            <Text className="text-sm font-medium text-foreground">Retry</Text>
          </Pressable>
        ) : null}
      </CenteredStep>
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
          ListHeaderComponent={<CategoryListHeader suggestion={suggestion} />}
          renderItem={({ item, index }) => {
            const isLoneLastTile = index === loneTileIndex;
            const tile = (
              <CategoryTile
                grid={grid}
                cat={item}
                selected={selectedCategoryId === item.id}
                primaryAutoSuggested={
                  selectedCategoryId === item.id && item.id === autoSuggestedCategoryId
                }
                onSelect={() => onSelectCategory(item.id)}
                preventStretch={isLoneLastTile}
                resolvedColumnWidth={isLoneLastTile ? resolvedColumnWidth : undefined}
              />
            );
            if (!isLoneLastTile) return tile;
            return (
              <View className="min-w-0 flex-1 flex-row items-stretch justify-center">{tile}</View>
            );
          }}
        />
      </View>
    </View>
  );
};

export default Category;
