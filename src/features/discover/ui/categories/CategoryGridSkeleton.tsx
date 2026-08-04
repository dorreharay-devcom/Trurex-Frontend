import React from 'react';
import { View } from 'react-native';

type CategoryGridSkeletonProps = {
  itemPct: `${number}%`;
  count: number;
};

const CategoryGridSkeleton = ({ itemPct, count }: CategoryGridSkeletonProps) => {
  return (
    <View className="w-full flex-row flex-wrap">
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={{ width: itemPct, padding: 6 }}>
          <View style={{ width: '100%', height: 74 }} className="rounded-2xl bg-border/40" />
        </View>
      ))}
    </View>
  );
};

export default CategoryGridSkeleton;
