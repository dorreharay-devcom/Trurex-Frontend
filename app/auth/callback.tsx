import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { Auth } from '~/services/AuthService';
import { Routes } from '~/constants/routes';
import { Theme } from '~/theme/Theme';
import { completeOAuthSessionFromUrl } from '~/auth/oauth';
import { isWeb } from '~/utils';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    let active = true;

    const goMain = () => {
      if (active) {
        router.replace(Routes.Main);
      }
    };

    const goLogin = () => {
      if (active) {
        router.replace(Routes.Login);
      }
    };

    const bootstrap = async () => {
      if (!isWeb) {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          try {
            await completeOAuthSessionFromUrl(initialUrl);
          } catch {
            return;
          }
        }
      }

      const { data } = await Auth.getSession();
      if (data.session) {
        goMain();
      }
    };

    bootstrap();

    const {
      data: { subscription },
    } = Auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        goMain();
      } else if (event === 'SIGNED_OUT') {
        goLogin();
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={Theme.colors.primary} />
    </View>
  );
}
