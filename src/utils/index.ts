import { makeRedirectUri } from 'expo-auth-session';
import { Platform, Dimensions, type TextStyle } from 'react-native';
import { isNonEmptyString, isPlainObject } from './guards';

export { cn, type ClassValue } from './general';

export function unknownErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && isNonEmptyString(error.message)) return error.message;
  if (isPlainObject(error) && isNonEmptyString(error.message)) return error.message;
  return fallback;
}

export const isWeb = Platform.OS === 'web';

const flexRowSingleLineText: TextStyle = {
  flex: 1,
  minWidth: 0,
};

export const singleLineEllipsisTextStyle: TextStyle = isWeb
  ? ({
      ...flexRowSingleLineText,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      maxWidth: '100%',
    } as TextStyle)
  : flexRowSingleLineText;

export const webContainerStyle = isWeb
  ? { maxWidth: 1280, width: '100%' as const, alignSelf: 'center' as const }
  : undefined;
export const { width, height } = Dimensions.get('window');

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

const APP_SCHEME = process.env.EXPO_PUBLIC_APP_SCHEME ?? 'trurex';
const AUTH_CALLBACK_PATH = 'auth/callback';
const RESET_PASSWORD_REDIRECT_URL = 'https://trurex.netlify.app/reset-password';

export const getRedirectUrl = () =>
  isWeb
    ? `${window.location.origin}/${AUTH_CALLBACK_PATH}`
    : makeRedirectUri({ scheme: APP_SCHEME, path: AUTH_CALLBACK_PATH });

export const getResetPasswordRedirectUrl = () => RESET_PASSWORD_REDIRECT_URL;
