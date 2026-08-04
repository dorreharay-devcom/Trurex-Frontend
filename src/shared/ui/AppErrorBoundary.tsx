import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import type { ErrorBoundaryProps } from 'expo-router';
import { Theme } from '~/shared/theme/Theme';

const LOGO = require('@assets/truRexLogo.png');

const AppErrorBoundary = ({ error, retry }: ErrorBoundaryProps) => {
  return (
    <View
      className="flex-1 items-center justify-center gap-5 bg-background px-8"
      style={{ backgroundColor: Theme.colors.background }}
      accessibilityRole="alert"
    >
      <Image
        source={LOGO}
        style={{ width: 148, height: 46 }}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
      <View className="items-center gap-2">
        <Text className="text-center text-lg font-semibold text-foreground">
          Something went wrong
        </Text>
        <Text className="text-center text-sm text-muted-foreground">
          The screen hit an unexpected error. You can try again without restarting the app.
        </Text>
        {__DEV__ ? (
          <Text className="mt-2 max-w-md text-center text-xs text-destructive" selectable>
            {error.message}
          </Text>
        ) : null}
      </View>
      <Pressable
        onPress={() => {
          void retry();
        }}
        accessibilityRole="button"
        accessibilityLabel="Try again"
        className="rounded-lg bg-primary px-6 py-3 active:opacity-90"
      >
        <Text className="text-sm font-semibold text-primary-foreground">Try again</Text>
      </Pressable>
    </View>
  );
};

export default AppErrorBoundary;
