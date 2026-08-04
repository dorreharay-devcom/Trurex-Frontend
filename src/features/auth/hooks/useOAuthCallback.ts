import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { completeOAuthSessionFromUrl } from '~/features/auth/lib/oauth';
import { navigateAfterAuthenticatedSession } from '~/features/auth/lib/mfa';
import { useAuth } from '~/features/auth/providers';
import { AuthEvent } from '~/features/auth/types';
import { Auth } from '~/shared/api/client';
import { AuthApi } from '~/shared/api/auth';
import { Routes } from '~/shared/config/routes';
import { isWeb } from '~/shared/lib/ui/platform';
import { TAB } from '~/shared/config/mainTabs';
import { openMainTab } from '~/shared/lib/mainTab';

export function useOAuthCallback() {
  const router = useRouter();
  const { setMfaPending, setMfaChecking } = useAuth();
  const mfaCheckStartedRef = useRef(false);

  useEffect(() => {
    let active = true;

    const goMain = () => {
      if (active) openMainTab(router, TAB.discover);
    };

    const goLogin = () => {
      if (active) router.replace(Routes.Login);
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

    const completeNativeOAuthRedirect = async (): Promise<boolean> => {
      if (isWeb) return true;
      const initialUrl = await Linking.getInitialURL();
      if (!initialUrl) return true;
      try {
        await completeOAuthSessionFromUrl(initialUrl);
        return true;
      } catch {
        await setMfaPending(false);
        setMfaChecking(false);
        goLogin();
        return false;
      }
    };

    const bootstrap = async () => {
      const redirectCompleted = await completeNativeOAuthRedirect();
      if (!redirectCompleted) return;

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
      if (event === AuthEvent.SignedIn && session) {
        goAfterMfaCheck();
        return;
      }
      if (event === AuthEvent.SignedOut) goLogin();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [router, setMfaChecking, setMfaPending]);
}
