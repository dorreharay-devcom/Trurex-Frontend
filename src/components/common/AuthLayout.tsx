import React from 'react';
import { ScrollView, View } from 'react-native';

const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <ScrollView
    className="flex-1 bg-background"
    contentContainerClassName="min-h-screen items-center justify-center px-4 py-8"
    keyboardShouldPersistTaps="handled"
  >
    <View className="w-full max-w-sm space-y-8">{children}</View>
  </ScrollView>
);

export default AuthLayout;
