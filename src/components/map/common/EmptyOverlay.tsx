import React from 'react';
import { View, Text } from 'react-native';
import { Search } from 'lucide-react-native';
import { Theme } from '~/theme/Theme';

export const EmptyOverlay: React.FC = () => (
  <View className="absolute inset-0 items-center justify-center z-10 px-4 pointer-events-none rounded-2xl">
    <Search size={32} color={Theme.colors.muted} style={{ opacity: 0.4, marginBottom: 8 }} />
    <Text className="text-sm text-muted-foreground font-medium text-center">No results nearby</Text>
    <Text className="text-xs text-muted-foreground mt-0.5 text-center">Try a different search</Text>
  </View>
);
