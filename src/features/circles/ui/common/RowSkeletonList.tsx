import React from 'react';
import { View } from 'react-native';

type Props = {
  count?: number;
  className?: string;
};

const RowSkeletonList = ({ count = 3, className = 'gap-3' }: Props) => {
  return (
    <View className={className}>
      {Array.from({ length: count }, (_, index) => (
        <View key={index} className="h-16 rounded-xl bg-border/40" />
      ))}
    </View>
  );
};

export default RowSkeletonList;
