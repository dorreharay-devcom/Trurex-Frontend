import React from 'react';
import { View } from 'react-native';
import { profileGridLayout } from '~/features/profile/ui/ProfileGridCell';

type Props = {
  windowWidth: number;
};

export function ProfileRexGridSkeleton({ windowWidth }: Props) {
  const { numColumns, gap } = profileGridLayout(windowWidth);
  const halfGap = gap / 2;

  return (
    <View className="w-full flex-row flex-wrap" style={{ marginHorizontal: -halfGap }}>
      {Array.from({ length: numColumns * 2 }, (_, i) => (
        <View
          key={i}
          style={{
            width: `${100 / numColumns}%`,
            paddingHorizontal: halfGap,
            marginBottom: gap,
          }}
        >
          <View style={{ width: '100%', aspectRatio: 1 }} className="rounded-xl bg-border/40" />
        </View>
      ))}
    </View>
  );
}
