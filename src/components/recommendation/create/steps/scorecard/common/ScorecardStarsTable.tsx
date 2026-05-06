import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Star } from 'lucide-react-native';
import type { CategoryRatingDimension } from '~/types/recommendation/rexCategoryCreateConfig';
import { Theme } from '~/theme/Theme';
import { cn } from '~/utils/general';

type Props = {
  sectionTitle?: string;
  dimensions: CategoryRatingDimension[];
  scores: Record<string, number | null>;
  onStarChange: (code: string, value: number) => void;
};

export function ScorecardStarsTable({
  sectionTitle = 'Star ratings',
  dimensions,
  scores,
  onStarChange,
}: Props) {
  return (
    <View className="space-y-1 rounded-xl border border-border bg-card p-4">
      <Text className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {sectionTitle}
      </Text>
      <View>
        {dimensions.map((dim, index) => {
          const value = scores[dim.code] ?? 0;
          const isLast = index === dimensions.length - 1;
          return (
            <View
              key={dim.code}
              className={cn(
                'flex-row items-center justify-between gap-3 py-2',
                !isLast && 'border-b border-border/50',
              )}
            >
              <View className="min-w-0 flex-1">
                <Text className="text-sm text-foreground">{dim.display_label}</Text>
                {dim.description ? (
                  <Text className="mt-0.5 text-xs italic text-muted-foreground">
                    {dim.description}
                  </Text>
                ) : null}
              </View>
              <View className="shrink-0 flex-row gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = star <= value;
                  return (
                    <Pressable
                      key={star}
                      hitSlop={4}
                      onPress={() => onStarChange(dim.code, star === value ? 0 : star)}
                      accessibilityRole="button"
                      accessibilityLabel={`${dim.display_label}: ${active ? star : 'zero'} of 5 stars`}
                      className="p-0.5 active:opacity-90"
                    >
                      <Star
                        size={20}
                        color={active ? Theme.colors.accentForeground : Theme.colors.border}
                        fill={active ? Theme.colors.accentForeground : 'transparent'}
                      />
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
