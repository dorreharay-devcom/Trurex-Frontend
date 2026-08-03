import React from 'react';
import { View } from 'react-native';

const PILL_SKELETON_WIDTHS = [56, 72, 64, 80, 68, 76, 60, 84] as const;

const PillSkeletonRow = ({ count = 6 }: { count?: number }) => {
  return (
    <View className="flex-row flex-wrap gap-2">
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          className="h-8 rounded-full bg-border/40"
          style={{ width: PILL_SKELETON_WIDTHS[i % PILL_SKELETON_WIDTHS.length] }}
        />
      ))}
    </View>
  );
};

export default PillSkeletonRow;
