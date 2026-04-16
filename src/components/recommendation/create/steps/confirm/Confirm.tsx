import React, { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { CREATE_REC_STEP_INNER } from '~/constants/recommendation/createLayout';
import { CreateStepTitle } from '../../CreateStepTitle';
import {
  averageCategoryRatings,
  getConfirmPreviewPlace,
  getConfirmCircleTitles,
  getConfirmTagLabels,
} from '~/utils/recommendation/confirmPreview';
import type { CreateRecSearchPlace, SearchEntryMode } from '~/types/recommendation/create';
import type { CategoryTagOption } from '~/types/recommendation/rexCategoryCreateConfig';
import { ConfirmPreviewCard } from './common';

type Props = {
  searchMode: SearchEntryMode;
  selectedSearchPlace: CreateRecSearchPlace | null;
  manualName: string;
  manualAddress: string;
  manualGeotag: { lat: number; lng: number } | null;
  selectedCategoryId: string | null;
  categoryRatings: Record<string, number | null>;
  scoreQuickTip: string;
  scoreReview: string;
  selectedCircleIds: Set<string>;
  subcategoryLabel: string | null;
  photoCount: number;
  selectedTagSlugs: string[];
  tagOptions: CategoryTagOption[];
};

export const Confirm: React.FC<Props> = ({
  searchMode,
  selectedSearchPlace,
  manualName,
  manualAddress,
  manualGeotag,
  selectedCategoryId,
  categoryRatings,
  scoreQuickTip,
  scoreReview,
  selectedCircleIds,
  subcategoryLabel,
  photoCount,
  selectedTagSlugs,
  tagOptions,
}) => {
  const place = useMemo(
    () =>
      getConfirmPreviewPlace(
        searchMode,
        selectedSearchPlace,
        manualName,
        manualAddress,
        manualGeotag,
      ),
    [searchMode, selectedSearchPlace, manualName, manualAddress, manualGeotag],
  );

  const ratingDisplay = useMemo(() => averageCategoryRatings(categoryRatings), [categoryRatings]);
  const tagLabels = useMemo(
    () => getConfirmTagLabels(selectedTagSlugs, tagOptions),
    [selectedTagSlugs, tagOptions],
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
      <View className={`${CREATE_REC_STEP_INNER} gap-6`}>
        <View className="items-center space-y-2">
          <CreateStepTitle>Looking good! 🦖</CreateStepTitle>
          <Text className="text-center text-sm text-muted-foreground">
            Here&apos;s how your recommendation will appear
          </Text>
        </View>

        <ConfirmPreviewCard
          place={place}
          selectedCategoryId={selectedCategoryId}
          subcategoryLabel={subcategoryLabel}
          photoCount={photoCount}
          ratingDisplay={ratingDisplay}
          tagLabels={tagLabels}
          tip={tip}
          review={review}
          circleTitles={circleTitles}
        />
      </View>
    </ScrollView>
  );
};
