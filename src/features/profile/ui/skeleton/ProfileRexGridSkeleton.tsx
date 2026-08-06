import React from 'react';
import { View } from 'react-native';
import { profileGridLayout } from '~/features/profile/ui/ProfileGridCell';

type Props = {
  windowWidth: number;
};

export function ProfileRexGridSkeleton({ windowWidth }: Props) {
  const { numColumns, cellWidth, gap } = profileGridLayout(windowWidth);

  return (
    <View className="flex-row flex-wrap" style={{ gap }}>
      {Array.from({ length: numColumns * 2 }, (_, i) => (
        <View
          key={i}
          style={{ width: cellWidth, aspectRatio: 1 }}
          className="rounded-xl bg-border/40"
        />
      ))}
    </View>
  );
}
