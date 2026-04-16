import React from 'react';
import { View, Animated as RNAnimated } from 'react-native';
import type { useCreateRecWizard } from '~/hooks/recommendation';
import {
  REAL_ESTATE_CATEGORY_ID,
  getRexCategoryApiCode,
} from '~/constants/recommendation/rexCategories';
import {
  mapSubcategoriesFromConfig,
  REAL_ESTATE_SUBCATEGORIES,
} from '~/data/rexSubcategoryCatalog';
import type {
  CategoryCreateConfig,
  CategoryQuestion,
  CategoryRatingDimension,
  CategoryTagOption,
} from '~/types/recommendation/rexCategoryCreateConfig';
import { Search, Category, SubCategory, Scorecard, Photos, Circles, Confirm } from './steps';

type Flow = ReturnType<typeof useCreateRecWizard>;

type Props = {
  flow: Flow;
  stepOpacity: RNAnimated.Value;
  onTagLocation: () => void;
  tagLocationLoading: boolean;
  activeCreateConfig: CategoryCreateConfig | null;
  configLoading: boolean;
  mergedRatingDimensions: CategoryRatingDimension[];
  mergedQuestions: CategoryQuestion[];
  mergedTagOptions: CategoryTagOption[];
  subcategoryLabelForConfirm: string | null;
};

export const CreateModalBody: React.FC<Props> = ({
  flow,
  stepOpacity,
  onTagLocation,
  tagLocationLoading,
  activeCreateConfig,
  configLoading,
  mergedRatingDimensions,
  mergedQuestions,
  mergedTagOptions,
  subcategoryLabelForConfirm,
}) => {
  const categoryApiCode = getRexCategoryApiCode(flow.selectedCategoryId);
  const configLoadError =
    !!flow.selectedCategoryId && !!categoryApiCode && !configLoading && !activeCreateConfig;
  const configReady =
    !flow.selectedCategoryId || (!!categoryApiCode && !!activeCreateConfig && !configLoadError);

  const typeStepSubcategories = (() => {
    if (flow.selectedCategoryId !== REAL_ESTATE_CATEGORY_ID) return [];
    if (activeCreateConfig?.subcategories?.length) {
      return mapSubcategoriesFromConfig(activeCreateConfig.subcategories);
    }
    return REAL_ESTATE_SUBCATEGORIES;
  })();

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
            ratingDimensions={mergedRatingDimensions}
            categoryRatings={flow.categoryRatings}
            onCategoryRatingChange={flow.setCategoryRating}
            questions={mergedQuestions}
            questionAnswers={flow.questionAnswers}
            onQuestionAnswer={flow.setQuestionAnswer}
            tagOptions={mergedTagOptions}
            selectedTagSlugs={flow.selectedTagSlugs}
            onToggleTag={flow.toggleTagSlug}
            configReady={configReady && !configLoading}
            configLoadError={configLoadError}
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
          <Circles selectedIds={flow.selectedCircleIds} onToggle={flow.toggleCircleId} />
        )}
        {flow.stepId === 'confirm' && (
          <Confirm
            searchMode={flow.searchMode}
            selectedSearchPlace={flow.selectedSearchPlace}
            manualName={flow.manualName}
            manualAddress={flow.manualAddress}
            manualGeotag={flow.manualGeotag}
            selectedCategoryId={flow.selectedCategoryId}
            categoryRatings={flow.categoryRatings}
            scoreQuickTip={flow.scoreQuickTip}
            scoreReview={flow.scoreReview}
            selectedCircleIds={flow.selectedCircleIds}
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
