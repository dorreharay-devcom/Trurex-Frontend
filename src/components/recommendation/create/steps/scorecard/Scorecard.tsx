import React, { useMemo } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { REAL_ESTATE_CATEGORY_ID } from '~/constants/recommendation/rexCategories';
import { useCategoryIcon } from '~/hooks/useCategoryIcon';
import { CREATE_REC_STEP_INNER } from '~/constants/recommendation/createLayout';
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
  ScorecardValueForMoney,
} from './common';

type Props = {
  selectedCategoryId: string | null;
  categoryDisplayName?: string | null;
  showQuickTip: boolean;
  useExperienceReviewCopy: boolean;
  subcategoryStarTitle: string | null;
  categoryRatingDimensions: CategoryRatingDimension[];
  subcategoryRatingDimensions: CategoryRatingDimension[];
  categoryRatings: Record<string, number | null>;
  onCategoryRatingChange: (code: string, value: number) => void;
  categoryQuestions: CategoryQuestion[];
  subcategoryQuestions: CategoryQuestion[];
  questionAnswers: Record<string, string>;
  onQuestionAnswer: (questionCode: string, optionCode: string) => void;
  tagOptions: CategoryTagOption[];
  selectedTagSlugs: string[];
  onToggleTag: (slug: string) => void;
  configReady: boolean;
  configLoadError: boolean;
  scoreValueForMoney: number | null;
  onScoreValueForMoneyChange: (v: number | null) => void;
  quickTip: string;
  onQuickTipChange: (v: string) => void;
  reviewText: string;
  onReviewChange: (v: string) => void;
};

export const Scorecard: React.FC<Props> = ({
  selectedCategoryId,
  categoryDisplayName,
  showQuickTip,
  useExperienceReviewCopy,
  subcategoryStarTitle,
  categoryRatingDimensions,
  subcategoryRatingDimensions,
  categoryRatings,
  onCategoryRatingChange,
  categoryQuestions,
  subcategoryQuestions,
  questionAnswers,
  onQuestionAnswer,
  tagOptions,
  selectedTagSlugs,
  onToggleTag,
  configReady,
  configLoadError,
  scoreValueForMoney,
  onScoreValueForMoneyChange,
  quickTip,
  onQuickTipChange,
  reviewText,
  onReviewChange,
}) => {
  const categoryEmoji = useCategoryIcon(selectedCategoryId);
  const starDimensions = useMemo(
    () => [...categoryRatingDimensions, ...subcategoryRatingDimensions],
    [categoryRatingDimensions, subcategoryRatingDimensions],
  );

  const totalSlots = starDimensions.length;

  const filledCount = useMemo(
    () =>
      starDimensions.filter((d) => {
        const v = categoryRatings[d.code];
        return v != null && v > 0;
      }).length,
    [starDimensions, categoryRatings],
  );

  const hasAnyStars = categoryRatingDimensions.length > 0 || subcategoryRatingDimensions.length > 0;

  return (
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="items-center pb-16"
    >
      <View className={cn(CREATE_REC_STEP_INNER, 'gap-6')}>
        <ScorecardIntro
          categoryEmoji={categoryEmoji}
          typeStepDisplayName={subcategoryStarTitle}
          filledCount={filledCount}
          totalSlots={totalSlots}
        />

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
            {categoryRatingDimensions.length > 0 ? (
              <ScorecardStarsTable
                dimensions={categoryRatingDimensions}
                scores={categoryRatings}
                onStarChange={onCategoryRatingChange}
              />
            ) : null}

            {subcategoryRatingDimensions.length > 0 ? (
              <ScorecardStarsTable
                sectionTitle={subcategoryStarTitle ?? 'More detail'}
                dimensions={subcategoryRatingDimensions}
                scores={categoryRatings}
                onStarChange={onCategoryRatingChange}
              />
            ) : null}

            {!hasAnyStars ? (
              <Text className="text-center text-sm text-muted-foreground">
                No star ratings for this category.
              </Text>
            ) : null}

            {categoryQuestions.length > 0 ? (
              <ScorecardQuestions
                sectionTitle="Questions"
                questions={categoryQuestions}
                answers={questionAnswers}
                onSelectOption={onQuestionAnswer}
              />
            ) : null}

            {subcategoryQuestions.length > 0 ? (
              <ScorecardQuestions
                sectionTitle={null}
                questionStyle="emphasized"
                questions={subcategoryQuestions}
                answers={questionAnswers}
                onSelectOption={onQuestionAnswer}
              />
            ) : null}

            <ScorecardTagOptions
              tagOptions={tagOptions}
              selectedSlugs={selectedTagSlugs}
              onToggle={onToggleTag}
            />

            {showQuickTip ? (
              <ScorecardQuickTip
                value={quickTip}
                onChangeText={onQuickTipChange}
                categoryCode={selectedCategoryId}
                categoryDisplayName={categoryDisplayName}
              />
            ) : null}

            <ScorecardValueForMoney
              value={scoreValueForMoney}
              onChange={onScoreValueForMoneyChange}
              useRipOffLabels={selectedCategoryId === REAL_ESTATE_CATEGORY_ID}
            />
          </>
        )}

        <ScorecardReview
          title={useExperienceReviewCopy ? 'Your experience' : 'Your review'}
          showOptionalHint={useExperienceReviewCopy}
          placeholder={
            useExperienceReviewCopy ? 'How was your experience? What stood out?' : undefined
          }
          value={reviewText}
          onChangeText={onReviewChange}
        />
      </View>
    </ScrollView>
  );
};
