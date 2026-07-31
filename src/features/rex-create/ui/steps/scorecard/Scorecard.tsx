import React, { useMemo } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useCategoryIcon } from '~/hooks/useCategoryIcon';
import { CREATE_REC_STEP_INNER } from '~/features/rex-create/config/layout';
import type { CreateRecFlow } from '~/features/rex-create/hooks/useCreateRecWizard';
import type { CreateConfigState } from '~/features/rex-create/hooks/useCategoryCreateConfig';
import { cn } from '~/utils/general';
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
  scorecard: CreateRecFlow['scorecard'];
  config: CreateConfigState;
};

const Scorecard: React.FC<Props> = ({ selectedCategoryId, scorecard, config }) => {
  const categoryEmoji = useCategoryIcon(selectedCategoryId);
  const categoryDims = config.categoryDimsOnly;
  const subDims = config.subDimsOnly;
  const ready = config.configReady && !config.configLoading;

  const starDimensions = useMemo(() => [...categoryDims, ...subDims], [categoryDims, subDims]);

  const totalSlots = useMemo(
    () => starDimensions.filter((d) => !d.show_toggle).length,
    [starDimensions],
  );

  const filledCount = useMemo(
    () =>
      starDimensions.filter((d) => {
        if (d.show_toggle) return false;
        const v = scorecard.categoryRatings[d.code];
        return v != null && v > 0;
      }).length,
    [starDimensions, scorecard.categoryRatings],
  );

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
          typeStepDisplayName={config.subcategoryLabel}
          filledCount={filledCount}
          totalSlots={totalSlots}
        />

        {config.configLoadError ? (
          <Text className="text-center text-sm text-destructive">
            We couldn&apos;t load this category. Try another one or check your connection.
          </Text>
        ) : !ready ? (
          <Text className="text-center text-sm text-muted-foreground">
            Loading category configuration…
          </Text>
        ) : (
          <>
            {categoryDims.length > 0 ? (
              <ScorecardStarsTable
                key={`cat-${categoryDims.map((d) => d.code).join('|')}`}
                dimensions={categoryDims}
                scores={scorecard.categoryRatings}
                onStarChange={scorecard.setCategoryRating}
              />
            ) : null}

            {subDims.length > 0 ? (
              <ScorecardStarsTable
                key={`sub-${subDims.map((d) => d.code).join('|')}`}
                sectionTitle={config.subcategoryLabel ?? 'More detail'}
                dimensions={subDims}
                scores={scorecard.categoryRatings}
                onStarChange={scorecard.setCategoryRating}
              />
            ) : null}

            {starDimensions.length === 0 ? (
              <Text className="text-center text-sm text-muted-foreground">
                No star ratings for this category.
              </Text>
            ) : null}

            <ScorecardValueForMoney
              value={scorecard.scoreValueForMoney}
              onChange={scorecard.setScoreValueForMoney}
            />

            {config.showQuickTip ? (
              <ScorecardQuickTip
                value={scorecard.scoreQuickTip}
                onChangeText={scorecard.setScoreQuickTip}
                categoryCode={selectedCategoryId}
                categoryDisplayName={config.activeCreateConfig?.display_name ?? null}
              />
            ) : null}

            {config.categoryQsOnly.length > 0 ? (
              <ScorecardQuestions
                sectionTitle="Questions"
                questions={config.categoryQsOnly}
                answers={scorecard.questionAnswers}
                onAnswerChange={scorecard.setQuestionAnswer}
              />
            ) : null}

            {config.subQsOnly.length > 0 ? (
              <ScorecardQuestions
                sectionTitle={null}
                questionStyle="emphasized"
                questions={config.subQsOnly}
                answers={scorecard.questionAnswers}
                onAnswerChange={scorecard.setQuestionAnswer}
              />
            ) : null}
          </>
        )}

        <ScorecardReview
          title={config.useExperienceReviewCopy ? 'Your experience' : 'Your review'}
          showOptionalHint={config.useExperienceReviewCopy}
          placeholder={
            config.useExperienceReviewCopy ? 'How was your experience? What stood out?' : undefined
          }
          value={scorecard.scoreReview}
          onChangeText={scorecard.setScoreReview}
        />

        {ready && !config.configLoadError ? (
          <ScorecardTagOptions
            tagOptions={config.mergedTagOptions}
            selectedSlugs={scorecard.selectedTagSlugs}
            onToggle={scorecard.toggleTagSlug}
          />
        ) : null}
      </View>
    </ScrollView>
  );
};

export default Scorecard;
