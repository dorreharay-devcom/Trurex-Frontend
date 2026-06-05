import React, { useEffect, useMemo } from 'react';
import { View, Animated as RNAnimated } from 'react-native';
import type { useCreateRecWizard } from '~/hooks/recommendation';
import { useMyCircles } from '~/hooks/useMyCircles';
import { isSensitiveRexSubcategory } from '~/constants/recommendation/sensitiveRexSubcategories';
import { getRexCategoryApiCode } from '~/constants/recommendation/rexCategories';
import {
  mapApiCirclesToDisplayRows,
  sortCirclesForRingStack,
} from '~/utils/recommendation/recCircles';
import { mapSubcategoriesFromConfig } from '~/data/rexSubcategoryCatalog';
import type {
  CategoryCreateConfig,
  CategoryQuestion,
  CategoryRatingDimension,
  CategoryTagOption,
} from '~/types/recommendation/rexCategoryCreateConfig';
import { Search, Category, SubCategory, Scorecard, Photos, Circles, Confirm } from './steps';

type Flow = ReturnType<typeof useCreateRecWizard>;

type Props = {
  visible: boolean;
  flow: Flow;
  stepOpacity: RNAnimated.Value;
  onTagLocation: () => void;
  tagLocationLoading: boolean;
  activeCreateConfig: CategoryCreateConfig | null;
  configLoading: boolean;
  mergedTagOptions: CategoryTagOption[];
  categoryDimsOnly: CategoryRatingDimension[];
  subDimsOnly: CategoryRatingDimension[];
  categoryQsOnly: CategoryQuestion[];
  subQsOnly: CategoryQuestion[];
  subcategoryStarTitle: string | null;
  showQuickTip: boolean;
  useExperienceReviewCopy: boolean;
  subcategoryLabelForConfirm: string | null;
};

export const CreateModalBody: React.FC<Props> = ({
  visible,
  flow,
  stepOpacity,
  onTagLocation,
  tagLocationLoading,
  activeCreateConfig,
  configLoading,
  mergedTagOptions,
  categoryDimsOnly,
  subDimsOnly,
  categoryQsOnly,
  subQsOnly,
  subcategoryStarTitle,
  showQuickTip,
  useExperienceReviewCopy,
  subcategoryLabelForConfirm,
}) => {
  const { ensureDefaultCircleSelectionFromApiOrder } = flow;
  const categoryApiCode = getRexCategoryApiCode(flow.selectedCategoryId);
  const configLoadError =
    !!flow.selectedCategoryId && !!categoryApiCode && !configLoading && !activeCreateConfig;
  const configReady =
    !flow.selectedCategoryId || (!!categoryApiCode && !!activeCreateConfig && !configLoadError);

  const typeStepSubcategories = activeCreateConfig?.subcategories?.length
    ? mapSubcategoriesFromConfig(activeCreateConfig.subcategories)
    : [];

  const {
    data: apiCircles,
    isLoading: circlesLoading,
    isError: circlesError,
    refetch: refetchCircles,
  } = useMyCircles(visible);

  const displayCircles = useMemo(() => {
    const sorted = apiCircles?.length ? sortCirclesForRingStack(apiCircles) : [];
    return sorted.length ? mapApiCirclesToDisplayRows(sorted) : [];
  }, [apiCircles]);

  useEffect(() => {
    if (!visible || displayCircles.length === 0) return;
    ensureDefaultCircleSelectionFromApiOrder(displayCircles);
  }, [visible, displayCircles, ensureDefaultCircleSelectionFromApiOrder]);

  const circleTitleLookup = useMemo(
    () => displayCircles.map((c) => ({ id: c.id, title: c.title })),
    [displayCircles],
  );

  const showCirclesFetchSpinner = Boolean(
    visible && circlesLoading && apiCircles === undefined && !circlesError,
  );

  return (
    <View className="min-h-0 w-full flex-1">
      <RNAnimated.View key={flow.stepId} style={{ flex: 1, width: '100%', opacity: stepOpacity }}>
        {flow.stepId === 'search' && (
          <Search
            mode={flow.searchMode}
            searchQuery={flow.searchQuery}
            onSearchQueryChange={flow.setSearchQuery}
            selectedSearchPlace={flow.selectedSearchPlace}
            onSelectPlace={flow.selectSearchPlace}
            manualName={flow.manualName}
            onManualNameChange={flow.setManualName}
            manualAddress={flow.manualAddress}
            onManualAddressChange={flow.setManualAddress}
            manualGeotag={flow.manualGeotag}
            onlineName={flow.onlineName}
            onOnlineNameChange={flow.setOnlineName}
            onlineWebsiteUrl={flow.onlineWebsiteUrl}
            onOnlineWebsiteUrlChange={flow.setOnlineWebsiteUrl}
            onOnlinePlaceChange={flow.setOnlinePlaceSelected}
            onSelectManualAddress={flow.selectManualAddress}
            onOpenManual={flow.openManual}
            onBackToSearchSelect={flow.backToSearchSelect}
            onTagLocationPress={onTagLocation}
            tagLocationLoading={tagLocationLoading}
          />
        )}
        {flow.stepId === 'category' && (
          <Category
            selectedCategoryId={flow.selectedCategoryId}
            onSelectCategory={flow.setSelectedCategoryId}
            autoSuggestedCategoryId={flow.autoSuggestedCategoryId}
          />
        )}
        {flow.stepId === 'type' && (
          <SubCategory
            subCategories={typeStepSubcategories}
            selected={flow.selectedSubcategoryCode}
            onSelect={flow.setSelectedSubcategoryCode}
          />
        )}
        {flow.stepId === 'scorecard' && (
          <Scorecard
            selectedCategoryId={flow.selectedCategoryId}
            categoryDisplayName={activeCreateConfig?.display_name ?? null}
            showQuickTip={showQuickTip}
            useExperienceReviewCopy={useExperienceReviewCopy}
            subcategoryStarTitle={subcategoryStarTitle}
            categoryRatingDimensions={categoryDimsOnly}
            subcategoryRatingDimensions={subDimsOnly}
            categoryRatings={flow.categoryRatings}
            onCategoryRatingChange={flow.setCategoryRating}
            categoryQuestions={categoryQsOnly}
            subcategoryQuestions={subQsOnly}
            questionAnswers={flow.questionAnswers}
            onQuestionAnswer={flow.setQuestionAnswer}
            tagOptions={mergedTagOptions}
            selectedTagSlugs={flow.selectedTagSlugs}
            onToggleTag={flow.toggleTagSlug}
            configReady={configReady && !configLoading}
            configLoadError={configLoadError}
            scoreValueForMoney={flow.scoreValueForMoney}
            onScoreValueForMoneyChange={flow.setScoreValueForMoney}
            quickTip={flow.scoreQuickTip}
            onQuickTipChange={flow.setScoreQuickTip}
            reviewText={flow.scoreReview}
            onReviewChange={flow.setScoreReview}
          />
        )}
        {flow.stepId === 'photos' && (
          <Photos
            photoPaths={flow.photoStoragePaths}
            onPhotoPathsChange={flow.setPhotoStoragePaths}
          />
        )}
        {flow.stepId === 'circles' && (
          <Circles
            circles={displayCircles}
            showFetchSpinner={showCirclesFetchSpinner}
            loadError={circlesError}
            onRetry={() => void refetchCircles()}
            selectedIds={flow.selectedCircleIds}
            onToggle={flow.toggleCircleId}
            privateSelected={flow.privateRex}
            onPrivateSelectedChange={flow.setPrivateRex}
            showSensitiveNudge={isSensitiveRexSubcategory(flow.selectedSubcategoryCode)}
          />
        )}
        {flow.stepId === 'confirm' && (
          <Confirm
            searchMode={flow.searchMode}
            selectedSearchPlace={flow.selectedSearchPlace}
            manualName={flow.manualName}
            manualAddress={flow.manualAddress}
            manualGeotag={flow.manualGeotag}
            onlineName={flow.onlineName}
            onlineWebsiteUrl={flow.onlineWebsiteUrl}
            selectedCategoryId={flow.selectedCategoryId}
            categoryDisplayName={activeCreateConfig?.display_name ?? null}
            categoryRatings={flow.categoryRatings}
            scoreValueForMoney={flow.scoreValueForMoney}
            scoreQuickTip={flow.scoreQuickTip}
            scoreReview={flow.scoreReview}
            selectedCircleIds={flow.selectedCircleIds}
            privateRex={flow.privateRex}
            circleTitleLookup={circleTitleLookup}
            subcategoryLabel={subcategoryLabelForConfirm}
            photoCount={flow.photoStoragePaths.length}
            selectedTagSlugs={flow.selectedTagSlugs}
            tagOptions={mergedTagOptions}
          />
        )}
      </RNAnimated.View>
    </View>
  );
};
