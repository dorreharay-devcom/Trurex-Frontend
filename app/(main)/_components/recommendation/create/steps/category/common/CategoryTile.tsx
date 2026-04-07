import React from 'react';
import { Text, Pressable } from 'react-native';
import type { RexCategory } from '~/constants/recommendation/rexCategories';
import type { CategoryGridConfig } from '~/types/recommendation/categoryGrid';
import { Theme } from '~/theme/Theme';
import { cn } from '~/utils/general';

export type CategoryTileProps = {
  grid: CategoryGridConfig;
  cat: RexCategory;
  selected: boolean;
  primaryAutoSuggested: boolean;
  onSelect: () => void;
};

export function CategoryTile({
  grid,
  cat,
  selected,
  primaryAutoSuggested,
  onSelect,
}: CategoryTileProps) {
  const accent = primaryAutoSuggested ? Theme.colors.primary : cat.color;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={cat.label}
      onPress={onSelect}
      android_ripple={{ color: `${Theme.colors.primary}26` }}
      className={cn(
        'flex-1 min-w-0 rounded-xl items-center justify-center transition-transform duration-150 active:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        !selected && 'bg-muted/50',
      )}
      style={{
        minHeight: grid.tile.minHeight,
        paddingHorizontal: grid.tile.paddingHorizontal,
        paddingVertical: grid.tile.paddingVertical,
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? accent : Theme.colors.border,
        backgroundColor: selected ? `${accent}26` : undefined,
        ...(selected
          ? {
              shadowColor: accent,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: primaryAutoSuggested ? 0.28 : 0.22,
              shadowRadius: primaryAutoSuggested ? 5 : 4,
              elevation: 3,
            }
          : {}),
      }}
    >
      <Text
        className="leading-none text-center"
        style={{ fontSize: grid.emoji.fontSize, marginBottom: grid.emoji.marginBottom }}
      >
        {cat.emoji}
      </Text>
      <Text
        className="font-medium text-foreground text-center"
        style={{ fontSize: grid.label.fontSize, lineHeight: grid.label.lineHeight }}
        numberOfLines={grid.label.numberOfLines}
      >
        {cat.label}
      </Text>
    </Pressable>
  );
}
