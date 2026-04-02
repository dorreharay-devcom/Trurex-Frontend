import { Platform, Dimensions } from 'react-native';

export const isWeb = Platform.OS === 'web';
export const { width, height } = Dimensions.get('window');

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};
