import React from 'react';
import { View, Text } from 'react-native';

const AuthOrDivider = () => {
  return (
    <View className="flex-row items-center gap-3">
      <View className="flex-1 h-px bg-border" />
      <Text className="text-xs text-muted-foreground">or</Text>
      <View className="flex-1 h-px bg-border" />
    </View>
  );
};

export default AuthOrDivider;
