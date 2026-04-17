import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Globe, Heart, Lock, Users } from 'lucide-react-native';
import type { CreateRecCircle } from '~/constants/recommendation/createCircles';
import { cn } from '~/utils/general';
import { CircleRadioIndicator } from './CircleRadioIndicator';

const GLYPH_SIZE = 24;

function CircleGlyph({ circle: c }: { circle: CreateRecCircle }) {
  const color = c.accent;
  switch (c.iconKind) {
    case 'lock':
      return <Lock size={GLYPH_SIZE} color={color} />;
    case 'heart':
      return <Heart size={GLYPH_SIZE} color={color} />;
    case 'users':
      return <Users size={GLYPH_SIZE} color={color} />;
    case 'globe':
      return <Globe size={GLYPH_SIZE} color={color} />;
  }
}

type Props = {
  circle: CreateRecCircle;
  selected: boolean;
  onToggle: () => void;
};

export function CircleRow({ circle: c, selected, onToggle }: Props) {
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
        <CircleGlyph circle={c} />
      </View>

      <View className="min-w-0 flex-1">
        <Text className="font-semibold text-foreground">{c.title}</Text>
        <Text className="mt-0.5 text-xs text-muted-foreground">{c.subtitle}</Text>
      </View>

      <CircleRadioIndicator selected={selected} />
    </Pressable>
  );
}
