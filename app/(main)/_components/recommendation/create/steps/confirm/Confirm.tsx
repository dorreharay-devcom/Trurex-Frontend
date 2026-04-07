import React, { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { CREATE_REC_STEP_INNER } from '~/constants/recommendation/createLayout';
import { CreateStepTitle } from '../../CreateStepTitle';
import {
  averageStarRating,
  getConfirmAppliesLabels,
  getConfirmCircleTitles,
  getConfirmPreviewPlace,
} from '~/utils/recommendation/confirmPreview';
import type { SearchEntryMode } from '~/types/recommendation/create';
import { ConfirmPreviewCard } from './common';

type Props = {
  searchMode: SearchEntryMode;
  selectedPlaceId: string | null;
  manualName: string;
  manualAddress: string;
  manualGeotag: { lat: number; lng: number } | null;
  selectedCategoryId: string | null;
  scoreStarRatings: number[];
  scoreAppliesSelected: Record<string, boolean>;
  scoreQuickTip: string;
  scoreReview: string;
  selectedCircleIds: Set<string>;
};

export const Confirm: React.FC<Props> = ({
  searchMode,
  selectedPlaceId,
  manualName,
  manualAddress,
  manualGeotag,
  selectedCategoryId,
  scoreStarRatings,
  scoreAppliesSelected,
  scoreQuickTip,
  scoreReview,
  selectedCircleIds,
}) => {
  const place = useMemo(
    () =>
      getConfirmPreviewPlace(searchMode, selectedPlaceId, manualName, manualAddress, manualGeotag),
    [searchMode, selectedPlaceId, manualName, manualAddress, manualGeotag],
  );

  const ratingDisplay = useMemo(() => averageStarRating(scoreStarRatings), [scoreStarRatings]);
  const appliesLabels = useMemo(
    () => getConfirmAppliesLabels(scoreAppliesSelected),
    [scoreAppliesSelected],
  );
  const circleTitles = useMemo(
    () => getConfirmCircleTitles(selectedCircleIds),
    [selectedCircleIds],
  );

  const tip = scoreQuickTip.trim();
  const review = scoreReview.trim();

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="items-center pb-36"
    >
      <View className={CREATE_REC_STEP_INNER}>
        <CreateStepTitle>Looking good! 🦖</CreateStepTitle>
        <Text className="mt-1.5 text-center text-sm font-normal text-foreground leading-5">
          Here's how your recommendation will appear
        </Text>

        <ConfirmPreviewCard
          place={place}
          selectedCategoryId={selectedCategoryId}
          ratingDisplay={ratingDisplay}
          appliesLabels={appliesLabels}
          tip={tip}
          review={review}
          circleTitles={circleTitles}
        />
      </View>
    </ScrollView>
  );
};
