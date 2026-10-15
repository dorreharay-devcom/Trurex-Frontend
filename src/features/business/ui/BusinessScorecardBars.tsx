import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { SCORECARD_COLLAPSED_COUNT } from '~/features/business/lib/placeScorecard';
import ScoreBarRow from '~/features/business/ui/common/ScoreBarRow';
import type { DetailRatingRow } from '~/features/rex-detail/lib/detailRatings';
import { isListCollapsible, visibleListItems } from '~/shared/lib/data/collapsibleList';
import { ShowAllToggle } from '~/shared/ui/primitives/ShowAllToggle';

function BusinessScorecardBars({ rows }: { rows: DetailRatingRow[] }) {
  const [showAll, setShowAll] = useState(false);

  if (rows.length === 0) return null;

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Scorecard breakdown
        </Text>
        {isListCollapsible(rows, SCORECARD_COLLAPSED_COUNT) ? (
          <ShowAllToggle
            showAll={showAll}
            total={rows.length}
            onToggle={() => setShowAll((v) => !v)}
          />
        ) : null}
      </View>
      <View className="gap-3">
        {visibleListItems(rows, showAll, SCORECARD_COLLAPSED_COUNT).map((row) => (
          <ScoreBarRow key={row.label} row={row} />
        ))}
      </View>
    </View>
  );
}

export default BusinessScorecardBars;
