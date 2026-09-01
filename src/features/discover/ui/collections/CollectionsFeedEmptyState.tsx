import React from 'react';
import { Text, View } from 'react-native';

type Props = {
  hasSearch?: boolean;
};

const CollectionsFeedEmptyState = ({ hasSearch = false }: Props) => (
  <View className="items-center py-16 px-4 gap-2">
    <Text className="text-4xl">🗂️</Text>
    <Text className="font-display font-semibold text-foreground text-center">
      {hasSearch ? 'No collections found.' : 'No public collections yet.'}
    </Text>
    <Text className="text-sm text-muted-foreground text-center">
      {hasSearch ? 'Try a different search.' : 'Check back soon.'}
    </Text>
  </View>
);

export default CollectionsFeedEmptyState;
