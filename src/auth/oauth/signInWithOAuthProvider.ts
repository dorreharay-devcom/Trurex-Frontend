import * as WebBrowser from 'expo-web-browser';
import { AuthApi } from '~/api/AuthApi';
import { isWeb, getRedirectUrl } from '~/utils';
import { completeOAuthSessionFromUrl } from './completeOAuthSession';
import type { OAuthProvider } from './types';

WebBrowser.maybeCompleteAuthSession();

export async function signInWithOAuthProvider(provider: OAuthProvider): Promise<void> {
  const redirectTo = getRedirectUrl();

  if (isWeb) {
    await AuthApi.signInWithOAuth({ provider, redirectTo });
    return;
  }

  const data = await AuthApi.signInWithOAuth({
    provider,
    redirectTo,
    skipBrowserRedirect: true,
  });

  if (!data?.url) {
    throw new Error('OAuth URL missing');
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type === 'cancel' || result.type === 'dismiss') {
    return;
  }

  if (result.type !== 'success' || !result.url) {
    throw new Error('OAuth sign-in was not completed');
  }

  await completeOAuthSessionFromUrl(result.url);
}
