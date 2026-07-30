import { useEffect, useRef } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { Auth } from '~/shared/api/client';
import { Routes } from '~/shared/config/routes';
import { Theme } from '~/shared/theme/Theme';
import { completeOAuthSessionFromUrl, navigateAfterAuthenticatedSession } from '~/features/auth';
import { isWeb } from '~/utils';
import { AuthApi } from '~/shared/api/auth';
import { useAuth } from '~/features/auth/providers';

export default function AuthCallback() {
  const router = useRouter();
  const { setMfaPending, setMfaChecking } = useAuth();
  const mfaCheckStartedRef = useRef(false);

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

    const goAfterMfaCheck = async () => {
      if (mfaCheckStartedRef.current) return;
      mfaCheckStartedRef.current = true;

      try {
        setMfaChecking(true);
        await navigateAfterAuthenticatedSession({
          setMfaPending,
          setMfaChecking,
          onRequireMfa: () => {
            if (active) router.replace(Routes.Mfa);
          },
          onReady: goMain,
        });
      } catch (error) {
        console.warn('[Auth] MFA initiation failed after OAuth sign-in', error);
        await setMfaPending(false);
        setMfaChecking(false);
        await AuthApi.signOut().catch(() => {});
        goLogin();
      }
    };

    const bootstrap = async () => {
      if (!isWeb) {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          try {
            await completeOAuthSessionFromUrl(initialUrl);
          } catch {
            await setMfaPending(false);
            setMfaChecking(false);
            goLogin();
            return;
          }
        }
      }

      const { data } = await Auth.getSession();
      if (data.session) {
        goAfterMfaCheck();
      } else {
        goLogin();
      }
    };

    bootstrap();

    const {
      data: { subscription },
    } = Auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        goAfterMfaCheck();
      } else if (event === 'SIGNED_OUT') {
        goLogin();
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [router, setMfaChecking, setMfaPending]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={Theme.colors.primary} />
    </View>
  );
}
