import React from 'react';
import { Text, View } from 'react-native';

const CollectionsFeedEmptyState = () => (
  <View className="items-center py-16 px-4 gap-2">
    <Text className="text-4xl">🗂️</Text>
    <Text className="font-display font-semibold text-foreground text-center">
      No public collections yet.
    </Text>
    <Text className="text-sm text-muted-foreground text-center">Check back soon.</Text>
  </View>
);

export default CollectionsFeedEmptyState;
