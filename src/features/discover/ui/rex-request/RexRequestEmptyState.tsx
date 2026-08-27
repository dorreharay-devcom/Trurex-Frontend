import React from 'react';
import { Text, View } from 'react-native';

const RexRequestEmptyState = () => (
  <View className="items-center py-16 px-4 gap-4">
    <Text className="text-4xl">📣</Text>
    <Text className="font-display font-semibold text-foreground text-center">
      No rex requests yet.
    </Text>
    <Text className="text-sm text-muted-foreground text-center">
      When someone asks their circle for a recommendation, it'll show up here.
    </Text>
  </View>
);

export default RexRequestEmptyState;
