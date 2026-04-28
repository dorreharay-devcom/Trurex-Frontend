import React from 'react';
import { Text, View } from 'react-native';

type Props = { containerClassName?: string };

export function FollowingEmptyState({ containerClassName = 'mb-6' }: Props) {
  return (
    <View className={`items-center py-8 ${containerClassName}`}>
      <Text className="text-center text-sm font-medium text-foreground">No one here yet</Text>
      <Text className="mt-2 max-w-sm px-4 text-center text-xs leading-relaxed text-muted-foreground">
        People you follow who haven't followed you back yet will show here. When they follow you
        back, they'll appear under Trusted.
      </Text>
    </View>
  );
}
