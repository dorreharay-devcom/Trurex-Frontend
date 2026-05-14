import * as Linking from 'expo-linking';
import { Platform, Dimensions, type TextStyle } from 'react-native';
import { isNonEmptyString } from './guards';

export { cn, type ClassValue } from './general';

export function unknownErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && isNonEmptyString(error.message)) return error.message;
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

export const getRedirectUrl = () =>
  isWeb ? `${window.location.origin}/auth/callback` : Linking.createURL('/auth/callback');
