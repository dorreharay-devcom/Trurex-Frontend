import React, { useState } from 'react';
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
  const [toggleOverride, setToggleOverride] = useState<Record<string, boolean>>({});

  const handleToggle = (code: string, enabled: boolean) => {
    setToggleOverride((prev) => ({ ...prev, [code]: enabled }));
    if (!enabled) onStarChange(code, 0);
  };

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
          const isConditional = Boolean(dim.show_toggle);
          const ratingVisible =
            !isConditional || (toggleOverride[dim.code] ?? value > 0);

          return (
            <View
              key={dim.code}
              className={cn('py-3', !isLast && 'border-b border-border/50')}
            >
              {isConditional ? (
                <View className="mb-2 flex-row items-center justify-between gap-3">
                  <Text className="min-w-0 flex-1 text-sm text-foreground">
                    Include {dim.display_label}?
                  </Text>
                  <Pressable
                    onPress={() => handleToggle(dim.code, !ratingVisible)}
                    accessibilityRole="switch"
                    accessibilityState={{ checked: ratingVisible }}
                    accessibilityLabel={`Include ${dim.display_label}`}
                    hitSlop={4}
                    className={cn(
                      'h-7 w-12 justify-center rounded-full px-0.5 active:opacity-90',
                      ratingVisible ? 'bg-primary' : 'bg-border',
                    )}
                  >
                    <View
                      className={cn(
                        'h-6 w-6 rounded-full bg-white shadow-sm',
                        ratingVisible ? 'self-end' : 'self-start',
                      )}
                    />
                  </Pressable>
                </View>
              ) : null}

              {ratingVisible ? (
                <>
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
                </>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}
