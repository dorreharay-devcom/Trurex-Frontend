import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { CategoryPickerTile } from '~/constants/recommendation/rexCategories';
import type { CategoryGridConfig } from '~/types/recommendation/categoryGrid';
import { Theme } from '~/theme/Theme';
import { cn } from '~/utils/general';

export type CategoryTileProps = {
  grid: CategoryGridConfig;
  cat: CategoryPickerTile;
  selected: boolean;
  primaryAutoSuggested: boolean;
  onSelect: () => void;
};

export function CategoryTile({
  grid,
  cat,
  selected,
  primaryAutoSuggested: _primaryAutoSuggested,
  onSelect,
}: CategoryTileProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={cat.label}
      onPress={onSelect}
      android_ripple={{ color: `${Theme.colors.primary}26` }}
      className={cn(
        'min-w-0 flex-1 flex-col items-center justify-center rounded-xl border-2 bg-card p-3 transition-transform duration-150 active:scale-[0.95] active:opacity-90',
        selected ? 'border-primary bg-primary/10 shadow-sm' : 'border-border bg-card',
      )}
      style={{
        minHeight: grid.tile.minHeight,
      }}
    >
      <View className="w-full items-center gap-1.5">
        <Text className="text-center text-2xl leading-none">{cat.emoji}</Text>
        <Text
          className={cn(
            'w-full text-center text-xs font-medium leading-tight',
            selected ? 'text-foreground' : 'text-muted-foreground',
          )}
          numberOfLines={grid.label.numberOfLines}
        >
          {cat.label}
        </Text>
      </View>
    </Pressable>
  );
}
