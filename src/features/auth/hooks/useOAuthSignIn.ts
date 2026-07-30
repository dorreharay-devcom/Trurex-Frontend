import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithOAuthProvider, type OAuthProvider } from '~/features/auth/lib/oauth';
import { Routes } from '~/shared/config/routes';
import { isWeb, unknownErrorMessage } from '~/utils';
import { AuthApi } from '~/shared/api/auth';
import { useAuth } from '~/features/auth/providers/AuthProvider';
import { navigateAfterAuthenticatedSession } from '~/features/auth/lib/mfa';

const providerLabel: Record<OAuthProvider, string> = {
  google: 'Google',
  apple: 'Apple',
};

export function useOAuthSignIn() {
  const router = useRouter();
  const { setMfaPending, setMfaChecking } = useAuth();
  const [oauthPending, setOauthPending] = useState(false);

  const signInWithOAuth = useCallback(
    async (provider: OAuthProvider) => {
      setOauthPending(true);
      let signedIn = false;
      try {
        setMfaChecking(true);
        await signInWithOAuthProvider(provider);
        if (!isWeb) {
          const session = await AuthApi.getSession();
          if (session) {
            signedIn = true;
            await navigateAfterAuthenticatedSession({
              setMfaPending,
              setMfaChecking,
              onRequireMfa: () => router.replace(Routes.Mfa),
              onReady: () => router.replace(Routes.Main),
            });
          } else {
            await setMfaPending(false);
            setMfaChecking(false);
          }
        }
      } catch (error: unknown) {
        await setMfaPending(false);
        setMfaChecking(false);
        if (signedIn) {
          await AuthApi.signOut().catch(() => {});
        }
        const label = providerLabel[provider];
        Alert.alert(
          `${label} sign-in failed`,
          unknownErrorMessage(error, 'Something went wrong. Please try again.'),
        );
      } finally {
        setOauthPending(false);
      }
    },
    [router, setMfaChecking, setMfaPending],
  );

  return { signInWithOAuth, oauthPending };
}
