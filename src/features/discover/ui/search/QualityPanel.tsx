import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Star } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import type { SearchFiltersState } from '~/features/discover/hooks/useSearchFilters';

const STARS = [1, 2, 3, 4, 5] as const;

const QualityPanel = ({ filters }: { filters: SearchFiltersState }) => {
  return (
    <View>
      <Text className="mb-3 text-xs text-muted-foreground">Filter by overall quality rating</Text>
      <View className="flex-row gap-1">
        {STARS.map((star) => {
          const selected = filters.qualityFilter != null && star <= filters.qualityFilter;
          return (
            <Pressable
              key={star}
              hitSlop={4}
              onPress={() => filters.toggleQuality(star)}
              accessibilityRole="button"
              accessibilityLabel={`Quality filter: ${star} star${star === 1 ? '' : 's'}`}
              className="p-0.5 active:opacity-90"
            >
              <Star
                size={20}
                color={selected ? Theme.colors.ratingStar : Theme.colors.border}
                fill={selected ? Theme.colors.ratingStar : 'transparent'}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default QualityPanel;
