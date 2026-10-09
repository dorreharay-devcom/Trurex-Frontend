import React from 'react';
import { View } from 'react-native';
import ScoreCard from '~/features/business/ui/common/ScoreCard';
import type { PlaceSummaryRow } from '~/features/business/types/placeSummary';

function BusinessScoreCards({ summary }: { summary: PlaceSummaryRow }) {
  if (summary.global_score == null) return null;

  const showNetworkScore = summary.network_rex_count > 0 && summary.network_score != null;

  return (
    <View className="flex-row gap-3">
      <ScoreCard
        icon="score"
        score={summary.global_score}
        label="TruRex score"
        caption={`Based on ${summary.scored_rex_count} Rex`}
      />
      {showNetworkScore ? (
        <ScoreCard
          icon="network"
          score={summary.network_score as number}
          label="Your network"
          caption={`From ${summary.network_rex_count} in your Circles`}
        />
      ) : null}
    </View>
  );
}

export default BusinessScoreCards;
