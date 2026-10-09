import React from 'react';
import { Text, View } from 'react-native';
import type { DetailRatingRow } from '~/features/rex-detail/lib/detailRatings';

function ScoreBarRow({ row }: { row: DetailRatingRow }) {
  const percent = Math.max(0, Math.min(100, (row.value / 5) * 100));

  return (
    <View className="gap-1">
      <View className="flex-row items-center justify-between">
        <Text className="text-sm text-foreground">{row.label}</Text>
        <Text className="text-xs text-muted-foreground">{row.value.toFixed(1)}</Text>
      </View>
      <View className="h-2 w-full rounded-full bg-border/60">
        <View className="h-2 rounded-full bg-rating-star" style={{ width: `${percent}%` }} />
      </View>
    </View>
  );
}

export default ScoreBarRow;
