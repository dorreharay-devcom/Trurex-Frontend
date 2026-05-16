import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import type { CategoryTagOption } from '~/types/recommendation/rexCategoryCreateConfig';
import { groupTagOptionsByTagGroup } from '~/utils/recommendation/recCreateFlow';
import { cn } from '~/utils/general';

type Props = {
  tagOptions: CategoryTagOption[];
  selectedSlugs: string[];
  onToggle: (slug: string) => void;
};

export function ScorecardTagOptions({ tagOptions, selectedSlugs, onToggle }: Props) {
  const groups = useMemo(() => groupTagOptionsByTagGroup(tagOptions), [tagOptions]);
  if (groups.length === 0) return null;

  return (
    <View className="gap-5">
      <Text className="text-xs font-semibold uppercase tracking-wider text-foreground">
        What applies?
      </Text>
      {groups.map((g) => (
        <View key={g.groupTitle || '__ungrouped'} className="gap-2">
          {g.groupTitle ? (
            <Text className="text-xs font-normal uppercase tracking-wide text-foreground">
              {g.groupTitle.toUpperCase()}
            </Text>
          ) : null}
          <View className="flex-row flex-wrap gap-2">
            {g.tags.map((t) => {
              const on = selectedSlugs.includes(t.slug);
              return (
                <Pressable
                  key={t.slug}
                  onPress={() => onToggle(t.slug)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 active:opacity-90',
                    on ? 'border-border/80 bg-border/60' : 'border-border bg-muted/50',
                  )}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                >
                  <Text className="text-sm text-foreground">{t.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}
