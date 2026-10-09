import React from 'react';
import { Text, View } from 'react-native';
import ScoreBarRow from '~/features/business/ui/common/ScoreBarRow';
import type { DetailRatingRow } from '~/features/rex-detail/lib/detailRatings';

function BusinessScorecardBars({ rows }: { rows: DetailRatingRow[] }) {
  if (rows.length === 0) return null;

  return (
    <View className="gap-3">
      <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Scorecard breakdown
      </Text>
      <View className="gap-3">
        {rows.map((row) => (
          <ScoreBarRow key={row.label} row={row} />
        ))}
      </View>
    </View>
  );
}

export default BusinessScorecardBars;
