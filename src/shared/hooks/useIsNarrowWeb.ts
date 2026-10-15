import { useWindowDimensions } from 'react-native';
import { isWeb } from '~/shared/lib/ui/platform';

const NARROW_WEB_BREAKPOINT = 500;

export function useIsNarrowWeb(): boolean {
  const { width } = useWindowDimensions();
  return isWeb && width < NARROW_WEB_BREAKPOINT;
}
