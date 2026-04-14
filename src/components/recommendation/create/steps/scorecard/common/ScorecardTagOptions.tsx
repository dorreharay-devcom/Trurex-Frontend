import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { CategoryTagOption } from '~/types/recommendation/rexCategoryCreateConfig';
import { cn } from '~/utils/general';

type Props = {
  tagOptions: CategoryTagOption[];
  selectedSlugs: string[];
  onToggle: (slug: string) => void;
};

export function ScorecardTagOptions({ tagOptions, selectedSlugs, onToggle }: Props) {
  if (tagOptions.length === 0) return null;

  return (
    <View className="space-y-3">
      <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Tags
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {tagOptions.map((t) => {
          const on = selectedSlugs.includes(t.slug);
          return (
            <Pressable
              key={t.slug}
              onPress={() => onToggle(t.slug)}
              className={cn(
                'rounded-full border px-3 py-1.5 active:opacity-90',
                on ? 'border-primary bg-primary' : 'border-border bg-muted/50',
              )}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
            >
              <Text
                className={cn(
                  'text-sm font-medium',
                  on ? 'text-primary-foreground' : 'text-muted-foreground',
                )}
              >
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
