import React, { useMemo } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { getRexCategoryById } from '~/constants/recommendation/rexCategories';
import { CREATE_REC_STEP_INNER } from '~/constants/recommendation/createLayout';
import { countFilledCategoryRatings } from '~/utils/recommendation/scorecardStep';
import { cn } from '~/utils/general';
import type {
  CategoryQuestion,
  CategoryRatingDimension,
  CategoryTagOption,
} from '~/types/recommendation/rexCategoryCreateConfig';
import {
  ScorecardIntro,
  ScorecardStarsTable,
  ScorecardQuestions,
  ScorecardTagOptions,
  ScorecardQuickTip,
  ScorecardReview,
} from './common';

type Props = {
  selectedCategoryId: string | null;
  ratingDimensions: CategoryRatingDimension[];
  categoryRatings: Record<string, number | null>;
  onCategoryRatingChange: (code: string, value: number) => void;
  questions: CategoryQuestion[];
  questionAnswers: Record<string, string>;
  onQuestionAnswer: (questionCode: string, optionCode: string) => void;
  tagOptions: CategoryTagOption[];
  selectedTagSlugs: string[];
  onToggleTag: (slug: string) => void;
  configReady: boolean;
  configLoadError: boolean;
  quickTip: string;
  onQuickTipChange: (v: string) => void;
  reviewText: string;
  onReviewChange: (v: string) => void;
};

export const Scorecard: React.FC<Props> = ({
  selectedCategoryId,
  ratingDimensions,
  categoryRatings,
  onCategoryRatingChange,
  questions,
  questionAnswers,
  onQuestionAnswer,
  tagOptions,
  selectedTagSlugs,
  onToggleTag,
  configReady,
  configLoadError,
  quickTip,
  onQuickTipChange,
  reviewText,
  onReviewChange,
}) => {
  const categoryEmoji = getRexCategoryById(selectedCategoryId ?? '')?.emoji ?? '📍';
  const filledCount = useMemo(() => countFilledCategoryRatings(categoryRatings), [categoryRatings]);

  return (
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="items-center pb-36"
    >
      <View className={cn(CREATE_REC_STEP_INNER, 'gap-6')}>
        <ScorecardIntro categoryEmoji={categoryEmoji} filledCount={filledCount} />

        {configLoadError ? (
          <Text className="text-center text-sm text-destructive">
            We couldn&apos;t load this category. Try another one or check your connection.
          </Text>
        ) : !configReady ? (
          <Text className="text-center text-sm text-muted-foreground">
            Loading category configuration…
          </Text>
        ) : (
          <>
            {ratingDimensions.length > 0 ? (
              <ScorecardStarsTable
                dimensions={ratingDimensions}
                scores={categoryRatings}
                onStarChange={onCategoryRatingChange}
              />
            ) : (
              <Text className="text-center text-sm text-muted-foreground">
                No star ratings for this category.
              </Text>
            )}

            <ScorecardQuestions
              questions={questions}
              answers={questionAnswers}
              onSelectOption={onQuestionAnswer}
            />

            <ScorecardTagOptions
              tagOptions={tagOptions}
              selectedSlugs={selectedTagSlugs}
              onToggle={onToggleTag}
            />
          </>
        )}

        <ScorecardQuickTip value={quickTip} onChangeText={onQuickTipChange} />
        <ScorecardReview value={reviewText} onChangeText={onReviewChange} />
      </View>
    </ScrollView>
  );
};
