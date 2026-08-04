import React from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import { MAP_VIEW_MIN_HEIGHT } from '~/features/map/config/mapUi';

type Props = {
  pixelHeight: number;
  onLayout: (event: LayoutChangeEvent) => void;
};

const WebMapLoading = ({ pixelHeight, onLayout }: Props) => {
  return (
    <View
      className="min-h-0 w-full flex-1 self-stretch overflow-hidden rounded-2xl border border-border bg-card"
      style={{ minHeight: MAP_VIEW_MIN_HEIGHT }}
      onLayout={onLayout}
    >
      <View
        className="w-full flex-1 bg-muted/30"
        style={{ height: pixelHeight, minHeight: MAP_VIEW_MIN_HEIGHT }}
      />
    </View>
  );
};

export default WebMapLoading;
