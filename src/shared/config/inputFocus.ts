import { Platform } from 'react-native';

export const INPUT_FOCUS_RING_CLASS =
  Platform.OS === 'web'
    ? 'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40'
    : '';

export const INPUT_FOCUS_BORDER_CLASS =
  Platform.OS === 'web' ? 'focus:outline-none focus:border-primary focus:ring-primary/40' : '';
