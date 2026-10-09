import React from 'react';
import { Text, View } from 'react-native';
import BusinessPhotoGrid from '~/features/business/ui/BusinessPhotoGrid';
import CategoryChip from '~/features/business/ui/common/CategoryChip';
import type { PlaceSummaryRow } from '~/features/business/types/placeSummary';

type Props = {
  summary: PlaceSummaryRow;
  photoPaths: string[];
};

function BusinessHeader({ summary, photoPaths }: Props) {
  return (
    <View className="gap-4">
      <BusinessPhotoGrid photoPaths={photoPaths} categoryIcon={summary.categories[0]?.icon} />
      <View>
        <Text className="font-display text-2xl font-bold text-foreground">
          {summary.place_name ?? 'Business'}
        </Text>
        {summary.normalized_address ? (
          <Text className="mt-1 text-sm text-muted-foreground">{summary.normalized_address}</Text>
        ) : null}
      </View>
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
