import { Redirect, Stack, usePathname } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '~/services/AuthContext';
import { Routes } from '~/constants/routes';
import { Theme } from '~/theme/Theme';

export default function AuthLayout() {
  const { session, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  if (session && pathname !== Routes.ResetPassword) {
    return <Redirect href={Routes.Main} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
