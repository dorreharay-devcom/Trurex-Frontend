import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Globe } from 'lucide-react-native';
import type { CreateRecCircle } from '~/constants/recommendation/createCircles';
import { Theme } from '~/theme/Theme';
import { cn } from '~/utils/general';
import { CircleRadioIndicator } from './CircleRadioIndicator';

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
        selected ? 'border-primary bg-primary/10' : 'border-border bg-card',
      )}
    >
      <View
        className="h-12 w-12 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: c.iconBg }}
      >
        {c.variant === 'globe' ? (
          <Globe size={24} color={c.accent} />
        ) : (
          <View className="h-8 w-8 rounded-full" style={{ backgroundColor: c.accent }} />
        )}
      </View>

      <View className="min-w-0 flex-1">
        <Text className="font-semibold text-foreground">{c.title}</Text>
        <Text className="mt-0.5 text-xs text-muted-foreground">{c.subtitle}</Text>
      </View>

      <CircleRadioIndicator selected={selected} />
    </Pressable>
  );
}
