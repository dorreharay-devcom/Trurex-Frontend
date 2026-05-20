import { Platform } from 'react-native';

export const INPUT_FOCUS_RING_CLASS =
  Platform.OS === 'web' ? 'focus:outline-none focus:ring-2' : '';

export const INPUT_FOCUS_BORDER_CLASS =
  Platform.OS === 'web' ? 'focus:outline-none focus:border-primary' : '';
