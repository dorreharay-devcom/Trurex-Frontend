import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Auth } from '~/services/AuthService';
import { Routes } from '~/constants/routes';
import { Theme } from '~/theme/Theme';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = Auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        subscription.unsubscribe();
        router.replace(Routes.Main);
      } else if (event === 'SIGNED_OUT') {
        subscription.unsubscribe();
        router.replace(Routes.Login);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={Theme.colors.primary} />
    </View>
  );
}
