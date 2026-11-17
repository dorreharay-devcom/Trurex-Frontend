import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithOAuthProvider, type OAuthProvider } from '~/features/auth/lib/oauth';
import { TAB } from '~/shared/config/mainTabs';
import { openMainTab } from '~/shared/lib/mainTab';
import { navigateAfterAuthenticatedSession } from '~/features/auth/lib/mfa';
import { writeStoredBusinessSignupIntent } from '~/features/auth/lib/businessSignupIntentStorage';
import { useAuth } from '~/features/auth/providers/AuthProvider';
import type { OAuthSignInOptions } from '~/features/auth/types/oauth';
import { isWeb } from '~/shared/lib/ui/platform';
import { unknownErrorMessage } from '~/shared/lib/data/guards';
import { AuthApi } from '~/shared/api/authApi';

const providerLabel: Record<OAuthProvider, string> = {
  google: 'Google',
  apple: 'Apple',
};

const DEFAULT_OAUTH_SIGN_IN_OPTIONS: OAuthSignInOptions = { businessSignup: false };

export function useOAuthSignIn() {
  const router = useRouter();
  const { setMfaPending, setMfaChecking } = useAuth();
  const [oauthPending, setOauthPending] = useState(false);

  const signInWithOAuth = useCallback(
    async (
      provider: OAuthProvider,
      options: OAuthSignInOptions = DEFAULT_OAUTH_SIGN_IN_OPTIONS,
    ) => {
      setOauthPending(true);
      let signedIn = false;
      try {
        setMfaChecking(true);
        await writeStoredBusinessSignupIntent(options.businessSignup);
        await signInWithOAuthProvider(provider);
        if (!isWeb) {
          const session = await AuthApi.getSession();
          if (session) {
            signedIn = true;
            await navigateAfterAuthenticatedSession({
              setMfaPending,
              setMfaChecking,
              onRedirect: (href) => router.replace(href),
              onReady: () => openMainTab(router, TAB.discover),
            });
          } else {
            await writeStoredBusinessSignupIntent(false);
            await setMfaPending(false);
            setMfaChecking(false);
          }
        }
      } catch (error: unknown) {
        await writeStoredBusinessSignupIntent(false);
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
