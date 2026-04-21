import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Theme } from '~/theme/Theme';

type Props = { className?: string };

export function SectionSpinner({ className = 'mb-6 items-center py-4' }: Props) {
  return (
    <View className={className}>
      <ActivityIndicator color={Theme.colors.primary} />
    </View>
  );
}
