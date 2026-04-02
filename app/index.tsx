import { Redirect } from 'expo-router';
import { useAuth } from '~/services/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { Theme } from '~/theme/Theme';
import { Routes } from '~/constants/routes';

// TODO: set to false when Supabase is configured
const DEV_BYPASS_AUTH = true;

export default function InitialRoute() {
  const { session, loading } = useAuth();

  if (DEV_BYPASS_AUTH) return <Redirect href={Routes.Main} />;

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  return <Redirect href={session ? Routes.Main : Routes.Login} />;
}
