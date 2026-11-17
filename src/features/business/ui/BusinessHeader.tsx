import React from 'react';
import { Text, View } from 'react-native';
import BusinessPhotoGrid from '~/features/business/ui/BusinessPhotoGrid';
import CategoryChip from '~/features/business/ui/common/CategoryChip';
import type { PlaceSummaryRow } from '~/features/business/types/placeSummary';
import { USER_AVATARS_BUCKET } from '~/shared/config/app';
import { avatarImageTransform } from '~/shared/lib/media/imageTransform';
import SignedStorageImage from '~/shared/ui/media/SignedStorageImage';
import { VerifiedBadge } from '~/shared/ui/primitives/VerifiedBadge';

const LOGO_TRANSFORM = avatarImageTransform(48);

type Props = {
  summary: PlaceSummaryRow;
  photoPaths: string[];
};

function BusinessHeader({ summary, photoPaths }: Props) {
  const name = summary.business_name ?? summary.place_name ?? 'Business';
  const logoPath = summary.business_photo_path ?? null;

  return (
    <View className="gap-4">
      <BusinessPhotoGrid photoPaths={photoPaths} categoryIcon={summary.categories[0]?.icon} />
      <View className="flex-row items-center gap-3">
        {logoPath ? (
          <View className="h-12 w-12 overflow-hidden rounded-xl border border-border bg-accent">
            <SignedStorageImage
              bucket={USER_AVATARS_BUCKET}
              storagePath={logoPath}
              className="absolute inset-0"
              imageTransform={LOGO_TRANSFORM}
              recyclingKey={logoPath}
              accessibilityLabel={`${name} logo`}
            />
          </View>
        ) : null}
        <View className="min-w-0 flex-1">
          <View className="flex-row items-center gap-2">
            <Text className="shrink font-display text-2xl font-bold text-foreground">{name}</Text>
            {summary.is_verified_business ? <VerifiedBadge size={20} business /> : null}
          </View>
          {summary.normalized_address ? (
            <Text className="mt-1 text-sm text-muted-foreground">{summary.normalized_address}</Text>
          ) : null}
        </View>
      </View>
      {summary.business_description ? (
        <Text className="text-sm leading-relaxed text-foreground">
          {summary.business_description}
        </Text>
      ) : null}
      {summary.categories.length > 0 ? (
        <View className="flex-row flex-wrap gap-2">
          {summary.categories.map((category) => (
            <CategoryChip key={category.code} category={category} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

export default BusinessHeader;
