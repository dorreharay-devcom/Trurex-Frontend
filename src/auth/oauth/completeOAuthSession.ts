import * as QueryParams from 'expo-auth-session/build/QueryParams';
import { Auth } from '~/services/AuthService';

export async function completeOAuthSessionFromUrl(url: string): Promise<void> {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) {
    throw new Error(errorCode);
  }

  const accessToken = params.access_token;
  const refreshToken = params.refresh_token;

  if (accessToken && refreshToken) {
    const { error } = await Auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    if (error) {
      throw error;
    }
    return;
  }

  const code = params.code;
  if (code) {
    const { error } = await Auth.exchangeCodeForSession(code);
    if (error) {
      throw error;
    }
    return;
  }

  throw new Error('OAuth callback missing session credentials');
}
