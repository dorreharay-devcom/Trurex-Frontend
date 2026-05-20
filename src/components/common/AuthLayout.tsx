import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    className="flex-1 bg-background"
  >
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="flex-grow px-8 py-12"
      contentContainerStyle={{ paddingBottom: Platform.OS === 'web' ? 48 : 140 }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'none'}
      automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 items-center justify-center">
        <View className="w-full max-w-sm gap-8">{children}</View>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
);

export default AuthLayout;
