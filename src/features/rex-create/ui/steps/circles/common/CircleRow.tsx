import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { CircleDisplayRow } from '~/shared/types/circles';
import { cn } from '~/shared/lib/ui/styles';
import { CircleGlyph } from '~/features/circles/ui/CircleGlyph';
import CircleRadioIndicator from './CircleRadioIndicator';

const GLYPH_SIZE = 24;

type Props = {
  circle: CircleDisplayRow;
  selected: boolean;
  onToggle: () => void;
};

function CircleRow({ circle: c, selected, onToggle }: Props) {
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${c.title}, ${c.subtitle}`}
      className={cn(
        'flex-row items-center gap-4 rounded-xl border-2 p-4 active:opacity-95',
        selected
          ? 'border-primary bg-primary/10'
          : 'border-border bg-card active:border-primary/30',
      )}
    >
      <View
        className="h-12 w-12 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: c.iconBg }}
      >
        <CircleGlyph iconKind={c.iconKind} color={c.accent} size={GLYPH_SIZE} />
      </View>

      <View className="min-w-0 flex-1">
        <Text className="font-semibold text-foreground">{c.title}</Text>
        <Text className="mt-0.5 text-xs text-muted-foreground">{c.subtitle}</Text>
      </View>

      <CircleRadioIndicator selected={selected} />
    </Pressable>
  );
}

export default CircleRow;
