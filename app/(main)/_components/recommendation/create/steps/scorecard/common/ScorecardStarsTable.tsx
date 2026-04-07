import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Star } from 'lucide-react-native';
import { CREATE_REC_SCORE_ROWS } from '~/constants/recommendation/createScorecard';
import { Theme } from '~/theme/Theme';
import { cn } from '~/utils/general';

type Props = {
  starRatings: number[];
  onStarChange: (index: number, value: number) => void;
};

export function ScorecardStarsTable({ starRatings, onStarChange }: Props) {
  return (
    <View className="space-y-1 rounded-xl border border-border bg-card p-4">
      <Text className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Star ratings
      </Text>
      <View>
        {CREATE_REC_SCORE_ROWS.map((label, index) => {
          const value = starRatings[index] ?? 0;
          const isLast = index === CREATE_REC_SCORE_ROWS.length - 1;
          return (
            <View
              key={label}
              className={cn(
                'flex-row items-center justify-between gap-3 py-2',
                !isLast && 'border-b border-border/50',
              )}
            >
              <Text className="min-w-0 flex-1 text-sm text-foreground">{label}</Text>
              <View className="shrink-0 flex-row gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = star <= value;
                  return (
                    <Pressable
                      key={star}
                      hitSlop={4}
                      onPress={() => onStarChange(index, star === value ? 0 : star)}
                      accessibilityRole="button"
                      accessibilityLabel={`${label}: ${active ? star : 'zero'} of 5 stars`}
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
