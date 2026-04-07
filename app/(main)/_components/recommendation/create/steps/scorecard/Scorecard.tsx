import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { getRexCategoryById } from '~/constants/recommendation/rexCategories';
import { CREATE_REC_STEP_INNER } from '~/constants/recommendation/createLayout';
import { countFilledStarRatings } from '~/utils/recommendation/scorecardStep';
import { cn } from '~/utils/general';
import {
  ScorecardIntro,
  ScorecardStarsTable,
  ScorecardAppliesChips,
  ScorecardQuickTip,
  ScorecardReview,
} from './common';

type Props = {
  selectedCategoryId: string | null;
  starRatings: number[];
  onStarChange: (index: number, value: number) => void;
  appliesSelected: Record<string, boolean>;
  onToggleApplies: (label: string) => void;
  quickTip: string;
  onQuickTipChange: (v: string) => void;
  reviewText: string;
  onReviewChange: (v: string) => void;
};

export const Scorecard: React.FC<Props> = ({
  selectedCategoryId,
  starRatings,
  onStarChange,
  appliesSelected,
  onToggleApplies,
  quickTip,
  onQuickTipChange,
  reviewText,
  onReviewChange,
}) => {
  const categoryEmoji = getRexCategoryById(selectedCategoryId ?? '')?.emoji ?? '📍';
  const filledCount = useMemo(() => countFilledStarRatings(starRatings), [starRatings]);

  return (
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="items-center pb-36"
    >
      <View className={cn(CREATE_REC_STEP_INNER, 'gap-6')}>
        <ScorecardIntro categoryEmoji={categoryEmoji} filledCount={filledCount} />
        <ScorecardStarsTable starRatings={starRatings} onStarChange={onStarChange} />
        <ScorecardAppliesChips
          appliesSelected={appliesSelected}
          onToggleApplies={onToggleApplies}
        />
        <ScorecardQuickTip value={quickTip} onChangeText={onQuickTipChange} />
        <ScorecardReview value={reviewText} onChangeText={onReviewChange} />
      </View>
    </ScrollView>
  );
};
