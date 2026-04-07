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
        'flex-row items-center gap-3 rounded-[12px] border p-4 active:opacity-90',
        selected ? 'border-primary bg-primary/5' : 'border-border bg-card',
      )}
    >
      <View
        className="h-11 w-11 items-center justify-center rounded-full"
        style={{ backgroundColor: c.iconBg }}
      >
        {c.variant === 'globe' ? (
          <Globe size={22} color={c.accent} />
        ) : (
          <View
            className="h-4 w-4 rounded-full"
            style={{
              backgroundColor: c.accent,
              shadowColor: c.accent,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.35,
              shadowRadius: 2,
              elevation: 2,
            }}
          />
        )}
      </View>

      <View className="min-w-0 flex-1">
        <Text className="text-base font-medium text-foreground">{c.title}</Text>
        <Text className="mt-0.5 text-sm font-normal text-foreground">{c.subtitle}</Text>
      </View>

      <CircleRadioIndicator selected={selected} />
    </Pressable>
  );
}
