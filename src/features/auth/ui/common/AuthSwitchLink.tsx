import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { cn } from '~/shared/lib/ui/styles';

type Props = {
  prompt: string;
  actionLabel: string;
  onPress: () => void;
  accessibilityLabel: string;
  promptCentered?: boolean;
};

const AuthSwitchLink = ({
  prompt,
  actionLabel,
  onPress,
  accessibilityLabel,
  promptCentered,
}: Props) => (
  <View className="flex-row items-center justify-center">
    <Text className={cn('text-sm text-muted-foreground', promptCentered && 'text-center')}>
      {prompt}
      {'\u00A0'}
    </Text>
    <TouchableOpacity
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Text className="text-sm font-medium text-foreground">{actionLabel}</Text>
    </TouchableOpacity>
  </View>
);

export default AuthSwitchLink;
