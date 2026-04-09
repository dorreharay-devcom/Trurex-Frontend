import * as Linking from 'expo-linking';
import { Platform, Dimensions } from 'react-native';

export { cn, type ClassValue } from './general';

export const isWeb = Platform.OS === 'web';

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

export const getRedirectUrl = () => (isWeb ? window.location.origin : Linking.createURL('/'));
