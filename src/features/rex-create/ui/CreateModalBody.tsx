import React from 'react';
import { View, Animated as RNAnimated } from 'react-native';
import { STEP_ID } from '~/features/rex-create/types/create';
import type { CreateRecFlow } from '~/features/rex-create/hooks/useCreateRecWizard';
import type { CreateConfigState } from '~/features/rex-create/hooks/useCategoryCreateConfig';
import { useDisplayCircles } from '~/features/rex-create/hooks/useDisplayCircles';
import QueryErrorState from '~/shared/ui/query/QueryErrorState';
import StepSkeleton from './StepSkeleton';
import {
  SearchStep,
  Category,
  SubCategory,
  ScorecardStep,
  Photos,
  CirclesStep,
  ConfirmStep,
} from './steps';

type Props = {
  visible: boolean;
  flow: CreateRecFlow;
  config: CreateConfigState;
  stepOpacity: RNAnimated.Value;
  onTagLocation: () => void;
  tagLocationLoading: boolean;
  initialLoading?: boolean;
  loadError?: boolean;
  onRetryLoad?: () => void;
};

const CreateModalBody = ({
  visible,
  flow,
  config,
  stepOpacity,
  onTagLocation,
  tagLocationLoading,
  initialLoading = false,
  loadError = false,
  onRetryLoad,
}: Props) => {
  const circles = useDisplayCircles({
    visible: visible && !loadError,
    onLoaded: flow.circles.ensureDefaultCircleSelectionFromApiOrder,
  });
  const { stepId } = flow.nav;

  return (
    <View className="min-h-0 w-full flex-1">
      <RNAnimated.View key={stepId} style={{ flex: 1, width: '100%', opacity: stepOpacity }}>
        {loadError ? (
          <QueryErrorState
            title="Couldn't load this Rex"
            message="It may no longer be editable. Check your connection and try again."
            onRetry={onRetryLoad}
          />
        ) : initialLoading ? (
          <StepSkeleton />
        ) : (
          <>
            {stepId === STEP_ID.search && (
              <SearchStep
                flow={flow}
                onTagLocation={onTagLocation}
                tagLocationLoading={tagLocationLoading}
              />
            )}
            {stepId === STEP_ID.category && (
              <Category
                selectedCategoryId={flow.category.selectedCategoryId}
                onSelectCategory={flow.category.setSelectedCategoryId}
                autoSuggestedCategoryId={flow.category.autoSuggestedCategoryId}
              />
            )}
            {stepId === STEP_ID.type && (
              <SubCategory
                subCategories={config.subcategoryOptions}
                selected={flow.category.selectedSubcategoryCode}
                onSelect={flow.category.setSelectedSubcategoryCode}
              />
            )}
            {stepId === STEP_ID.scorecard && <ScorecardStep flow={flow} config={config} />}
            {stepId === STEP_ID.photos && (
              <Photos photoPaths={flow.photos.paths} onPhotoPathsChange={flow.photos.setPaths} />
            )}
            {stepId === STEP_ID.circles && <CirclesStep flow={flow} circles={circles} />}
            {stepId === STEP_ID.confirm && (
              <ConfirmStep
                flow={flow}
                config={config}
                circleTitleLookup={circles.circleTitleLookup}
              />
            )}
          </>
        )}
      </RNAnimated.View>
    </View>
  );
};

export default CreateModalBody;
