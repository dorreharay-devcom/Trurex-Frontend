import { Redirect, Stack, usePathname } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '~/services/AuthContext';
import { Routes } from '~/constants/routes';
import { Theme } from '~/theme/Theme';

export default function AuthLayout() {
  const { session, loading, mfaPending, mfaChecking } = useAuth();
  const pathname = usePathname();

  if (loading || mfaChecking) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  if (session && mfaPending && pathname !== Routes.Mfa) {
    return <Redirect href={Routes.Mfa} />;
  }

  if (session && !mfaPending && pathname !== Routes.ResetPassword && pathname !== Routes.Mfa && pathname !== Routes.Terms && pathname !== Routes.CommunityGuidelines) {
    return <Redirect href={Routes.Main} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
