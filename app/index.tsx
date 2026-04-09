import { Redirect } from 'expo-router';
import { useAuth } from '~/services/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { Theme } from '~/theme/Theme';
import { Routes } from '~/constants/routes';

export default function InitialRoute() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  return <Redirect href={session ? Routes.Main : Routes.Login} />;
}
