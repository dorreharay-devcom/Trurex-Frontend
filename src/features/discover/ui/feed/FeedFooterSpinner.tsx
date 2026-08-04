import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Theme } from '~/shared/theme/Theme';

function FeedFooterSpinner({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <View className="items-center py-6">
      <ActivityIndicator size="small" color={Theme.colors.primary} />
    </View>
  );
}

export default FeedFooterSpinner;
