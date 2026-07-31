import React from 'react';
import { View, Text } from 'react-native';

function SensitiveNudge() {
  return (
    <View className="flex-row items-start gap-3 rounded-xl border border-accent-foreground/20 bg-accent/60 p-4">
      <Text className="shrink-0 text-lg">👀</Text>
      <Text className="flex-1 text-sm text-foreground">
        <Text className="font-semibold">Heads up</Text>
        {' — you might want to think about who sees this one'}
      </Text>
    </View>
  );
}

export default SensitiveNudge;
