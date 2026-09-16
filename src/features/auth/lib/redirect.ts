import Constants from 'expo-constants';
import { makeRedirectUri } from 'expo-auth-session';
import { TRUREX_DEV_WEB_ORIGIN, TRUREX_WEB_ORIGIN } from '~/shared/config/app';
import { isWeb } from '~/shared/lib/ui/platform';

const APP_SCHEME = process.env.EXPO_PUBLIC_APP_SCHEME ?? 'trurex';
const AUTH_CALLBACK_PATH = 'auth/callback';
const isProductionApp = Constants.expoConfig?.extra?.appEnv === 'production';

export const getRedirectUrl = () =>
  isWeb
    ? `${window.location.origin}/${AUTH_CALLBACK_PATH}`
    : makeRedirectUri({ scheme: APP_SCHEME, path: AUTH_CALLBACK_PATH });

export const getResetPasswordRedirectUrl = () => {
  if (isWeb) return `${window.location.origin}/reset-password`;
  const origin = isProductionApp ? TRUREX_WEB_ORIGIN : TRUREX_DEV_WEB_ORIGIN;
  return `${origin}/reset-password`;
};
