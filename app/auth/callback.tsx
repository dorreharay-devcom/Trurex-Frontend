import { useEffect, useRef } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { Auth } from '~/services/AuthService';
import { Routes } from '~/constants/routes';
import { Theme } from '~/theme/Theme';
import { completeOAuthSessionFromUrl } from '~/auth/oauth';
import { checkMfaRequirement } from '~/auth/mfa';
import { isWeb } from '~/utils';
import { AuthApi } from '~/api/AuthApi';
import { useAuth } from '~/services/AuthContext';

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
        const mfa = await checkMfaRequirement();
        if (mfa.required) {
          await setMfaPending(true);
          setMfaChecking(false);
          if (active) router.replace(Routes.Mfa);
          return;
        }

        await setMfaPending(false);
        setMfaChecking(false);
        goMain();
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
