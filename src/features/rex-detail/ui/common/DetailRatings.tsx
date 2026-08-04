import React from 'react';
import { View, Text } from 'react-native';
import { Star } from 'lucide-react-native';
import type { RexDetailView } from '~/features/rex-detail/hooks/useRexDetail';
import { Theme } from '~/shared/theme/Theme';
import type { DetailRatingRow } from '~/features/rex-detail/lib/detailRatings';

const STAR_VALUES = [1, 2, 3, 4, 5];

function RatingRow({ rating }: { rating: DetailRatingRow }) {
  return (
    <View className="flex-row items-center justify-between gap-2">
      <Text className="min-w-0 flex-1 text-sm text-foreground">{rating.label}</Text>
      <View className="shrink-0 flex-row items-center gap-1.5">
        <View className="flex-row gap-0.5">
          {STAR_VALUES.map((n) => {
            const filled = n <= Math.round(rating.value);
            return (
              <Star
                key={n}
                size={14}
                color={filled ? Theme.colors.ratingStar : Theme.colors.border}
                fill={filled ? Theme.colors.ratingStar : 'transparent'}
              />
            );
          })}
        </View>
        <Text className="w-6 text-right text-xs text-muted-foreground">
          {rating.value.toFixed(1)}
        </Text>
      </View>
    </View>
  );
}

function DetailRatings({ ratings }: { ratings: RexDetailView['detailRatings'] }) {
  const hasRatings = ratings.overall != null || ratings.dimensions.length > 0;
  if (!hasRatings) return null;
  return (
    <View className="gap-3">
      <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Ratings
      </Text>
      <View className="gap-2">
        {ratings.overall ? <RatingRow rating={ratings.overall} /> : null}
        {ratings.overall != null && ratings.dimensions.length > 0 ? (
          <View className="my-1 border-b border-border/80" />
        ) : null}
        {ratings.dimensions.map((r, index) => (
          <RatingRow key={`${r.label}-${index}`} rating={r} />
        ))}
      </View>
    </View>
  );
}

export default DetailRatings;
