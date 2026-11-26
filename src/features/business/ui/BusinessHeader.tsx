import React, { type ReactNode } from 'react';
import { Text, View } from 'react-native';
import BusinessPhotoGrid from '~/features/business/ui/BusinessPhotoGrid';
import CategoryChip from '~/features/business/ui/common/CategoryChip';
import type { PlaceSummaryRow } from '~/features/business/types/placeSummary';
import { CATEGORY_ICON_FALLBACK } from '~/shared/api/categories';
import { VerifiedBadge } from '~/shared/ui/primitives/VerifiedBadge';

type Props = {
  summary: PlaceSummaryRow;
  photoPaths: string[];
  action?: ReactNode;
};

function BusinessHeader({ summary, photoPaths, action }: Props) {
  const name = summary.business_name ?? summary.place_name ?? 'Business';

  return (
    <View className="gap-4">
      <BusinessPhotoGrid photoPaths={photoPaths} categoryIcon={summary.categories[0]?.icon} />
      <View>
        <View className="flex-row items-center gap-2">
          <Text className="shrink font-display text-2xl font-bold text-foreground">{name}</Text>
          {summary.is_verified_business ? <VerifiedBadge size={20} business /> : null}
        </View>
        {summary.normalized_address ? (
          <Text className="mt-1 text-sm text-muted-foreground">
            {CATEGORY_ICON_FALLBACK} {summary.normalized_address}
          </Text>
        ) : null}
      </View>
      {summary.business_description ? (
        <Text className="text-sm leading-relaxed text-foreground">
          {summary.business_description}
        </Text>
      ) : null}
      {action}
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
