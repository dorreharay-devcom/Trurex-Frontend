import type { ViewStyle } from 'react-native';
import { isWeb } from '~/shared/lib/ui/platform';

export const webCardStyle: ViewStyle | undefined = isWeb
  ? { maxWidth: 680, width: '100%', alignSelf: 'center' }
  : undefined;
