import React, { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '~/shared/api/usersApi';
import { CREATE_REC_STEP_INNER } from '~/features/rex-create/config/layout';
import CreateStepTitle from '../../CreateStepTitle';
import { useAuth } from '~/features/auth/providers';
import {
  authorForConfirmPreview,
  averageCategoryRatings,
  getConfirmPreviewPlace,
  getConfirmSharingLabel,
  getConfirmTagLabels,
} from '~/features/rex-create/lib/confirmPreview';
import type { CreateRecSearchPlace, SearchEntryMode } from '~/features/rex-create/types/create';
import type { CategoryTagOption } from '~/features/rex-create/types/categoryCreateConfig';
import { ConfirmPreviewCard } from './common';

const DYNO_IMAGE_SOURCE = require('@assets/dyno.svg');

type Props = {
  searchMode: SearchEntryMode;
  selectedSearchPlace: CreateRecSearchPlace | null;
  manualName: string;
  manualAddress: string;
  manualGeotag: { lat: number; lng: number } | null;
  onlineName: string;
  onlineWebsiteUrl: string;
  selectedCategoryId: string | null;
  categoryDisplayName: string | null;
  categoryRatings: Record<string, number | null>;
  scoreValueForMoney: number | null;
  scoreQuickTip: string;
  scoreReview: string;
  selectedCircleIds: Set<string>;
  privateRex: boolean;
  circleTitleLookup: readonly { id: string; title: string }[];
  subcategoryLabel: string | null;
  photoCount: number;
  selectedTagSlugs: string[];
  tagOptions: CategoryTagOption[];
};

const Confirm: React.FC<Props> = ({
  searchMode,
  selectedSearchPlace,
  manualName,
  manualAddress,
  manualGeotag,
  onlineName,
  onlineWebsiteUrl,
  selectedCategoryId,
  categoryDisplayName,
  categoryRatings,
  scoreValueForMoney,
  scoreQuickTip,
  scoreReview,
  selectedCircleIds,
  privateRex,
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
        onlineName,
        onlineWebsiteUrl,
      ),
    [
      searchMode,
      selectedSearchPlace,
      manualName,
      manualAddress,
      manualGeotag,
      onlineName,
      onlineWebsiteUrl,
    ],
  );

  const ratingDisplay = useMemo(
    () => averageCategoryRatings(categoryRatings, scoreValueForMoney),
    [categoryRatings, scoreValueForMoney],
  );
  const tagLabels = useMemo(
    () => getConfirmTagLabels(selectedTagSlugs, tagOptions),
    [selectedTagSlugs, tagOptions],
  );
  const sharingLabel = useMemo(
    () => getConfirmSharingLabel(privateRex, selectedCircleIds, circleTitleLookup),
    [privateRex, selectedCircleIds, circleTitleLookup],
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
          <View className="flex-row items-center justify-center gap-2">
            <CreateStepTitle>Looking good!</CreateStepTitle>
            <Image
              source={DYNO_IMAGE_SOURCE}
              style={{ width: 26, height: 26 }}
              contentFit="contain"
              accessibilityLabel="TruRex dinosaur"
            />
          </View>
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
          sharingLabel={sharingLabel}
        />
      </View>
    </ScrollView>
  );
};

export default Confirm;
