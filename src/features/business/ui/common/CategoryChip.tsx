import React from 'react';
import { Text, View } from 'react-native';
import type { PlaceCategoryChip } from '~/features/business/types/placeSummary';

function CategoryChip({ category }: { category: PlaceCategoryChip }) {
  return (
    <View className="rounded-full border border-border/80 bg-border/40 px-2.5 py-1">
      <Text className="text-xs font-medium capitalize text-foreground">{category.name}</Text>
    </View>
  );
}

export default CategoryChip;
