import { makeRedirectUri } from 'expo-auth-session';
import { TRUREX_WEB_ORIGIN } from '~/shared/config/app';
import { isWeb } from '~/shared/lib/ui/platform';

const APP_SCHEME = process.env.EXPO_PUBLIC_APP_SCHEME ?? 'trurex';
const AUTH_CALLBACK_PATH = 'auth/callback';

export const getRedirectUrl = () =>
  isWeb
    ? `${window.location.origin}/${AUTH_CALLBACK_PATH}`
    : makeRedirectUri({ scheme: APP_SCHEME, path: AUTH_CALLBACK_PATH });

export const getResetPasswordRedirectUrl = () => `${TRUREX_WEB_ORIGIN}/reset-password`;
