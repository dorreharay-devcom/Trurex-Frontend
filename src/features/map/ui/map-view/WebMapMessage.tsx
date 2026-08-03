import React from 'react';
import { Text, View, type LayoutChangeEvent } from 'react-native';
import { MAP_VIEW_MIN_HEIGHT } from '~/features/map/config/mapUi';

type Props = {
  message: string;
  onLayout?: (event: LayoutChangeEvent) => void;
};

const WebMapMessage = ({ message, onLayout }: Props) => {
  return (
    <View
      className="w-full flex-1 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted/20 px-4"
      style={{ minHeight: MAP_VIEW_MIN_HEIGHT }}
      onLayout={onLayout}
    >
      <Text className="text-center text-sm text-muted-foreground">{message}</Text>
    </View>
  );
};

export default WebMapMessage;
