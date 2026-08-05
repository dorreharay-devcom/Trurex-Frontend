import React from 'react';
import { View } from 'react-native';
import { profileGridLayout } from '~/features/profile/ui/ProfileGridCell';

type Props = {
  windowWidth: number;
};

export function ProfileCollectionsSkeleton({ windowWidth }: Props) {
  const { numColumns, cellWidth, gap } = profileGridLayout(windowWidth);
  const height = Math.round(cellWidth * (224 / 176));

  return (
    <View className="flex-row flex-wrap p-4" style={{ gap }}>
      {Array.from({ length: numColumns * 2 }, (_, i) => (
        <View key={i} style={{ width: cellWidth, height }} className="rounded-xl bg-border/40" />
      ))}
    </View>
  );
}
