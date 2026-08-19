import React from 'react';
import { View, Text, type LayoutChangeEvent } from 'react-native';

type Props = {
  label: string;
  onLayout?: (event: LayoutChangeEvent) => void;
};

function TagChip({ label, onLayout }: Props) {
  return (
    <View
      onLayout={onLayout}
      className="self-start rounded-full border border-border/80 bg-border/40 px-2 py-0.5"
    >
      <Text className="text-xs font-medium text-foreground">{label}</Text>
    </View>
  );
}

export default TagChip;
