import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { CategoryPickerTile } from '~/features/rex-create/lib/categories';
import type { CategoryGridConfig } from '~/features/rex-create/lib/categories';
import { Theme } from '~/shared/theme/Theme';
import { isWeb } from '~/shared/lib/ui/platform';
import { cn } from '~/shared/lib/ui/styles';

export type CategoryTileProps = {
  grid: CategoryGridConfig;
  cat: CategoryPickerTile;
  selected: boolean;
  primaryAutoSuggested: boolean;
  onSelect: () => void;
  preventStretch?: boolean;
  resolvedColumnWidth?: number;
};

function CategoryTile({
  grid,
  cat,
  selected,
  primaryAutoSuggested: _primaryAutoSuggested,
  onSelect,
  preventStretch = false,
  resolvedColumnWidth,
}: CategoryTileProps) {
  const fixedWidth = preventStretch ? (resolvedColumnWidth ?? grid.tileWidth) : undefined;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={cat.label}
      onPress={onSelect}
      android_ripple={{ color: `${Theme.colors.primary}26` }}
      className={cn(
        'min-w-0 flex-col items-center justify-center rounded-xl border-2 bg-card p-3 active:scale-[0.95] active:opacity-90',
        preventStretch ? 'flex-shrink-0' : 'flex-1',
        selected ? 'border-primary bg-primary/15' : 'border-border bg-card',
      )}
      style={{
        minHeight: grid.tile.minHeight,
        ...(fixedWidth != null ? { width: fixedWidth, alignSelf: 'stretch' } : null),
      }}
    >
      <View className="w-full items-center gap-1.5">
        <View className="h-8 items-center justify-center">
          <Text className="text-center text-2xl" style={isWeb ? undefined : { lineHeight: 30 }}>
            {cat.emoji}
          </Text>
        </View>
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

export default CategoryTile;
