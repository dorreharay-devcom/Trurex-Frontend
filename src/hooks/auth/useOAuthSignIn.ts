import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithOAuthProvider, type OAuthProvider } from '~/auth/oauth';
import { Routes } from '~/constants/routes';
import { isWeb, unknownErrorMessage } from '~/utils';
import { AuthApi } from '~/api/AuthApi';

const providerLabel: Record<OAuthProvider, string> = {
  google: 'Google',
  apple: 'Apple',
};

export function useOAuthSignIn() {
  const router = useRouter();
  const [oauthPending, setOauthPending] = useState(false);

  const signInWithOAuth = useCallback(
    async (provider: OAuthProvider) => {
      setOauthPending(true);
      try {
        await signInWithOAuthProvider(provider);
        if (!isWeb) {
          const session = await AuthApi.getSession();
          if (session) {
            router.replace(Routes.Main);
          }
        }
      } catch (error: unknown) {
        const label = providerLabel[provider];
        Alert.alert(
          `${label} sign-in failed`,
          unknownErrorMessage(error, 'Something went wrong. Please try again.'),
        );
      } finally {
        setOauthPending(false);
      }
    },
    [router],
  );

  return { signInWithOAuth, oauthPending };
}
