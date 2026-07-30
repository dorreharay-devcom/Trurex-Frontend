import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '~/shared/theme/Theme';
import { isWeb } from '~/utils';

const FORM_MAX_WIDTH = 384;
const HORIZONTAL_PADDING = 32;
const TOP_PADDING = 48;
const WEB_BOTTOM_PADDING = 48;
const NATIVE_BOTTOM_PADDING = 64;

const keyboardBehavior = Platform.select({
  ios: 'padding' as const,
  android: 'height' as const,
  default: undefined,
});

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  if (isWeb) {
    return (
      <KeyboardAvoidingView className="flex-1 bg-background">
        <ScrollView
          className="flex-1 bg-background"
          contentContainerClassName="flex-grow px-8 py-12"
          contentContainerStyle={{ paddingBottom: WEB_BOTTOM_PADDING }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 items-center justify-center">
            <View className="w-full max-w-sm gap-8">{children}</View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={keyboardBehavior}
      style={{ flex: 1, backgroundColor: Theme.colors.background }}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: Theme.colors.background }}
        contentContainerStyle={{
          minHeight: height,
          paddingHorizontal: HORIZONTAL_PADDING,
          paddingTop: insets.top + TOP_PADDING,
          paddingBottom: insets.bottom + NATIVE_BOTTOM_PADDING,
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'none'}
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: '100%', maxWidth: FORM_MAX_WIDTH, gap: 32 }}>{children}</View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AuthLayout;
