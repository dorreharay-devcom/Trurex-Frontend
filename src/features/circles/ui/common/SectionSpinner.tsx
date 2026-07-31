import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Theme } from '~/shared/theme/Theme';

type Props = { className?: string };

const SectionSpinner = ({ className = 'mb-6 items-center py-4' }: Props) => {
  return (
    <View className={className}>
      <ActivityIndicator color={Theme.colors.primary} />
    </View>
  );
};

export default SectionSpinner;
