import React from 'react';
import { ScrollView, View } from 'react-native';

const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <ScrollView
    className="flex-1 bg-background"
    contentContainerClassName="flex-grow px-8 py-12"
    keyboardShouldPersistTaps="handled"
    showsVerticalScrollIndicator={false}
  >
    <View className="flex-1 items-center justify-center">
      <View className="w-full max-w-sm gap-8">{children}</View>
    </View>
  </ScrollView>
);

export default AuthLayout;
