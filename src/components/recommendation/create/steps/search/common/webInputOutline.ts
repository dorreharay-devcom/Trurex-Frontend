import { Platform } from 'react-native';

export const webNoOutline =
  Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : undefined;
