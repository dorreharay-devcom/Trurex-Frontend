import React from 'react';
import { View, Animated as RNAnimated } from 'react-native';
import type { useCreateRecWizard } from '~/hooks/recommendation';
import { Search, Category, Scorecard, Circles, Confirm } from './steps';

type Flow = ReturnType<typeof useCreateRecWizard>;

type Props = {
  flow: Flow;
  stepOpacity: RNAnimated.Value;
  onTagLocation: () => void;
};

export const CreateModalBody: React.FC<Props> = ({ flow, stepOpacity, onTagLocation }) => (
  <View className="min-h-0 w-full flex-1">
    <RNAnimated.View key={flow.stepId} style={{ flex: 1, width: '100%', opacity: stepOpacity }}>
      {flow.stepId === 'search' && (
        <Search
          mode={flow.searchMode}
          searchQuery={flow.searchQuery}
          onSearchQueryChange={flow.setSearchQuery}
          selectedPlaceId={flow.selectedPlaceId}
          onSelectPlace={(p: any) => flow.setSelectedPlaceId(p.id)}
          manualName={flow.manualName}
          onManualNameChange={flow.setManualName}
          manualAddress={flow.manualAddress}
          onManualAddressChange={flow.setManualAddress}
          manualGeotag={flow.manualGeotag}
          onOpenManual={flow.openManual}
          onBackToSearchSelect={flow.backToSearchSelect}
          onTagLocationPress={onTagLocation}
        />
      )}
      {flow.stepId === 'category' && (
        <Category
          selectedCategoryId={flow.selectedCategoryId}
          onSelectCategory={flow.setSelectedCategoryId}
          autoSuggestedCategoryId={flow.autoSuggestedCategoryId}
        />
      )}
      {flow.stepId === 'scorecard' && (
        <Scorecard
          selectedCategoryId={flow.selectedCategoryId}
          starRatings={flow.scoreStarRatings}
          onStarChange={flow.setScoreStarAt}
          appliesSelected={flow.scoreAppliesSelected}
          onToggleApplies={flow.toggleScoreApplies}
          quickTip={flow.scoreQuickTip}
          onQuickTipChange={flow.setScoreQuickTip}
          reviewText={flow.scoreReview}
          onReviewChange={flow.setScoreReview}
        />
      )}
      {flow.stepId === 'circles' && (
        <Circles selectedIds={flow.selectedCircleIds} onToggle={flow.toggleCircleId} />
      )}
      {flow.stepId === 'confirm' && (
        <Confirm
          searchMode={flow.searchMode}
          selectedPlaceId={flow.selectedPlaceId}
          manualName={flow.manualName}
          manualAddress={flow.manualAddress}
          manualGeotag={flow.manualGeotag}
          selectedCategoryId={flow.selectedCategoryId}
          scoreStarRatings={flow.scoreStarRatings}
          scoreAppliesSelected={flow.scoreAppliesSelected}
          scoreQuickTip={flow.scoreQuickTip}
          scoreReview={flow.scoreReview}
          selectedCircleIds={flow.selectedCircleIds}
        />
      )}
    </RNAnimated.View>
  </View>
);
