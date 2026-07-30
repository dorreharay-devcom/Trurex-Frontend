import * as WebBrowser from 'expo-web-browser';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import { Auth } from '~/shared/api/client';
import { AuthApi } from '~/shared/api/auth';
import { isWeb, getRedirectUrl } from '~/utils';
import type { OAuthProvider } from '../types/oauth';

export type { OAuthProvider };

export const OAuthBrowserResultType = {
  Cancel: 'cancel',
  Dismiss: 'dismiss',
  Success: 'success',
} as const;

const OAUTH_BROWSER_ABORTED = new Set<string>([
  OAuthBrowserResultType.Cancel,
  OAuthBrowserResultType.Dismiss,
]);

WebBrowser.maybeCompleteAuthSession();

function throwIfAuthError(error: Error | null): void {
  if (error) throw error;
}

export async function completeOAuthSessionFromUrl(url: string): Promise<void> {
  const { params, errorCode } = QueryParams.getQueryParams(url);
  if (errorCode) throw new Error(errorCode);

  const accessToken = params.access_token;
  const refreshToken = params.refresh_token;
  if (accessToken && refreshToken) {
    const { error } = await Auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    throwIfAuthError(error);
    return;
  }

  const code = params.code;
  if (!code) throw new Error('OAuth callback missing session credentials');

  const { error } = await Auth.exchangeCodeForSession(code);
  throwIfAuthError(error);
}

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
  if (!data?.url) throw new Error('OAuth URL missing');

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (OAUTH_BROWSER_ABORTED.has(result.type)) return;
  if (result.type !== OAuthBrowserResultType.Success || !('url' in result) || !result.url) {
    throw new Error('OAuth sign-in was not completed');
  }

  await completeOAuthSessionFromUrl(result.url);
}
