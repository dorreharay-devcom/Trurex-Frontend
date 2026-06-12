import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithOAuthProvider, type OAuthProvider } from '~/auth/oauth';
import { Routes } from '~/constants/routes';
import { isWeb, unknownErrorMessage } from '~/utils';
import { AuthApi } from '~/api/AuthApi';
import { checkMfaRequirement } from '~/auth/mfa';
import { useAuth } from '~/services/AuthContext';

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
            const mfa = await checkMfaRequirement();
            if (mfa.required) {
              await setMfaPending(true);
              setMfaChecking(false);
              router.replace(Routes.Mfa);
              return;
            }
            await setMfaPending(false);
            setMfaChecking(false);
            router.replace(Routes.Main);
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
