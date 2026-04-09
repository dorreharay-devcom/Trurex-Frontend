import { Redirect, Stack } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '~/services/AuthContext';
import { Routes } from '~/constants/routes';
import { Theme } from '~/theme/Theme';

export default function MainLayout() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  if (!session) {
    return <Redirect href={Routes.Login} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
