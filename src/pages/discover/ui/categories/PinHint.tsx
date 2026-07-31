import React from 'react';
import { View, Text } from 'react-native';
import { Pin } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';

const PinHint = () => {
  return (
    <View className="mt-3 flex-row items-center justify-center gap-1.5">
      <Pin size={10} color={Theme.colors.secondary} fill="transparent" strokeWidth={2.25} />
      <Text className="shrink text-xs text-muted-foreground text-center">
        Tap the pin on categories you use most to add them to your quick-access bar
      </Text>
    </View>
  );
};

export default PinHint;
