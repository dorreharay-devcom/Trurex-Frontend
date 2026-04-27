import React, { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '~/api/usersApi';
import { CREATE_REC_STEP_INNER } from '~/constants/recommendation/createLayout';
import { CreateStepTitle } from '../../CreateStepTitle';
import { useAuth } from '~/services/AuthContext';
import {
  authorForConfirmPreview,
  averageCategoryRatings,
  getConfirmPreviewPlace,
  getConfirmCircleTitles,
  getConfirmTagLabels,
} from '~/utils/recommendation/recCreateFlow';
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
  categoryDisplayName: string | null;
  categoryRatings: Record<string, number | null>;
  scoreValueForMoney: number | null;
  scoreQuickTip: string;
  scoreReview: string;
  selectedCircleIds: Set<string>;
  circleTitleLookup: readonly { id: string; title: string }[];
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
  categoryDisplayName,
  categoryRatings,
  scoreValueForMoney,
  scoreQuickTip,
  scoreReview,
  selectedCircleIds,
  circleTitleLookup,
  subcategoryLabel,
  photoCount,
  selectedTagSlugs,
  tagOptions,
}) => {
  const { user } = useAuth();
  const { data: meProfile } = useQuery({
    queryKey: ['getUserProfile', 'confirmPreview', user?.id],
    queryFn: () => getUserProfile({ input_user_id: user!.id }),
    enabled: !!user?.id,
  });
  const author = useMemo(
    () => authorForConfirmPreview(user, meProfile ?? undefined),
    [user, meProfile],
  );

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

  const ratingDisplay = useMemo(
    () => averageCategoryRatings(categoryRatings, scoreValueForMoney),
    [categoryRatings, scoreValueForMoney],
  );
  const tagLabels = useMemo(
    () => getConfirmTagLabels(selectedTagSlugs, tagOptions),
    [selectedTagSlugs, tagOptions],
  );
  const circleTitles = useMemo(
    () => getConfirmCircleTitles(selectedCircleIds, circleTitleLookup),
    [selectedCircleIds, circleTitleLookup],
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
          author={author}
          place={place}
          selectedCategoryId={selectedCategoryId}
          categoryDisplayName={categoryDisplayName}
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
