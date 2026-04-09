import React from 'react';
import { View, Text } from 'react-native';

type Props = {
  searchQuery: string;
  resultCount: number;
};

export const ResultsHeader: React.FC<Props> = ({ searchQuery, resultCount }) => (
  <View className="flex-row items-center justify-between mb-3">
    <Text className="text-sm font-display font-semibold text-foreground flex-1 pr-2">
      {searchQuery.trim() ? `Results for "${searchQuery.trim()}"` : 'Nearby Recommendations'}
    </Text>
    <Text className="text-xs text-muted-foreground">
      {resultCount} {resultCount === 1 ? 'spot' : 'spots'}
    </Text>
  </View>
);
