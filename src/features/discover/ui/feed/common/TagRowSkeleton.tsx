import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '~/shared/ui/primitives/Skeleton';
import { DISCOVER_TAG_ROW_GAP } from '~/features/discover/lib/discoverTagLayout';

function TagRowSkeleton() {
  return (
    <View className="flex-row" style={{ gap: DISCOVER_TAG_ROW_GAP }}>
      <Skeleton className="h-5 w-14 rounded-full" />
      <Skeleton className="h-5 w-20 rounded-full" />
    </View>
  );
}

export default TagRowSkeleton;
