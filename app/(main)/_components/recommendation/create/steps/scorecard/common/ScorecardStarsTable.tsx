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
    <View className="overflow-hidden rounded-[12px] border border-border bg-card">
      <View className="border-b border-border px-4 py-3">
        <Text className="text-[10px] font-normal uppercase tracking-wide text-foreground">
          Star ratings
        </Text>
      </View>
      {CREATE_REC_SCORE_ROWS.map((label, index) => {
        const value = starRatings[index] ?? 0;
        const isLast = index === CREATE_REC_SCORE_ROWS.length - 1;
        return (
          <View
            key={label}
            className={cn(
              'flex-row items-center justify-between px-4 py-3.5',
              !isLast && 'border-b border-border',
            )}
          >
            <Text className="min-w-0 flex-1 pr-3 text-sm font-normal text-foreground">{label}</Text>
            <View className="flex-row items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = star <= value;
                return (
                  <Pressable
                    key={star}
                    hitSlop={6}
                    onPress={() => onStarChange(index, star === value ? 0 : star)}
                    accessibilityRole="button"
                    accessibilityLabel={`${label}: ${active ? star : 'zero'} of 5 stars`}
                  >
                    <Star
                      size={20}
                      color={active ? Theme.colors.primary : Theme.colors.border}
                      fill={active ? Theme.colors.primary : 'transparent'}
                    />
                  </Pressable>
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
}
