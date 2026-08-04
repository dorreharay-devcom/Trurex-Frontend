import React from 'react';
import { Text, View } from 'react-native';

type Props = { containerClassName?: string };

const TrustedEmptyState = ({ containerClassName = 'mb-6' }: Props) => {
  return (
    <View className={`items-center py-8 ${containerClassName}`}>
      <Text className="text-center text-sm font-medium text-foreground">No one is Trusted yet</Text>
      <Text className="mt-2 max-w-sm px-4 text-center text-xs leading-relaxed text-muted-foreground">
        {`Follow people and when they follow you back, they'll appear here.`}
      </Text>
    </View>
  );
};

export default TrustedEmptyState;
