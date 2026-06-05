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
          const scaleLeft = dim.scale_left?.trim();
          const scaleRight = dim.scale_right?.trim();
          const hasScaleLabels = Boolean(scaleLeft || scaleRight);
          return (
            <View
              key={dim.code}
              className={cn(
                'py-3',
                !isLast && 'border-b border-border/50',
              )}
            >
              <View className="flex-row items-start justify-between gap-3">
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
                          color={active ? Theme.colors.ratingStar : Theme.colors.border}
                          fill={active ? Theme.colors.ratingStar : 'transparent'}
                        />
                      </Pressable>
                    );
                  })}
                </View>
              </View>
              {hasScaleLabels ? (
                <View className="mt-1 flex-row justify-between gap-3">
                  <Text className="min-w-0 flex-1 text-[11px] text-muted-foreground opacity-75">
                    {scaleLeft ?? ''}
                  </Text>
                  <Text className="min-w-0 flex-1 text-right text-[11px] text-muted-foreground opacity-75">
                    {scaleRight ?? ''}
                  </Text>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}
