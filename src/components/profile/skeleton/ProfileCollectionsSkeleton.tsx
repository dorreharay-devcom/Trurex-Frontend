import React from 'react';
import { View } from 'react-native';

type Props = {
  windowWidth: number;
};

export function ProfileCollectionsSkeleton({ windowWidth }: Props) {
  const gw = Math.min(windowWidth, 1280) - 66;
  const numCols = gw < 700 ? 2 : 4;
  const cw = Math.floor((gw - 12 * (numCols - 1)) / numCols);
  const height = Math.round(cw * (224 / 176));

  return (
    <View className="flex-row flex-wrap p-4" style={{ gap: 12 }}>
      {Array.from({ length: numCols * 2 }, (_, i) => (
        <View key={i} style={{ width: cw, height }} className="rounded-xl bg-border/40" />
      ))}
    </View>
  );
}
