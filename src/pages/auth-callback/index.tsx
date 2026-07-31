import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useOAuthCallback } from '~/features/auth/hooks/useOAuthCallback';
import { Theme } from '~/shared/theme/Theme';

function AuthCallbackPage() {
  useOAuthCallback();

  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color={Theme.colors.primary} />
    </View>
  );
}

export default AuthCallbackPage;
