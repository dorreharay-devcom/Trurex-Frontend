import { Redirect, Stack, usePathname } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '~/features/auth/providers';
import { Routes } from '~/shared/config/routes';
import { Theme } from '~/shared/theme/Theme';

const SIGNED_IN_ALLOWED_AUTH_ROUTES: readonly string[] = [
  Routes.ResetPassword,
  Routes.Mfa,
  Routes.Terms,
  Routes.CommunityGuidelines,
];

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

  if (session && !mfaPending && !SIGNED_IN_ALLOWED_AUTH_ROUTES.includes(pathname)) {
    return <Redirect href={Routes.Main} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
