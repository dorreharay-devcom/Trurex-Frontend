import React from 'react';
import { View } from 'react-native';

type Props = {
  windowWidth: number;
};

export function ProfileRexGridSkeleton({ windowWidth }: Props) {
  const gw = Math.min(windowWidth, 1280) - 66;
  const numCols = gw < 700 ? 2 : 4;
  const cw = Math.floor((gw - 12 * (numCols - 1)) / numCols);

  return (
    <View className="flex-row flex-wrap" style={{ gap: 12 }}>
      {Array.from({ length: numCols * 2 }, (_, i) => (
        <View key={i} style={{ width: cw, aspectRatio: 1 }} className="rounded-xl bg-border/40" />
      ))}
    </View>
  );
}
