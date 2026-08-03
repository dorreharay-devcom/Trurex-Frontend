import type { KeyboardAvoidingView } from 'react-native';
import { isAndroid, isIos, isWeb } from '~/shared/lib/ui/platform';

type KeyboardBehavior = React.ComponentProps<typeof KeyboardAvoidingView>['behavior'];

function paddingOrHeightBehavior(): KeyboardBehavior {
  if (isIos) return 'padding';
  if (isAndroid) return 'height';
  return undefined;
}

export const KEYBOARD_BEHAVIOR_IOS_PADDING: KeyboardBehavior = isIos ? 'padding' : undefined;

export const KEYBOARD_BEHAVIOR_NATIVE_PADDING: KeyboardBehavior = isWeb ? undefined : 'padding';

export const KEYBOARD_BEHAVIOR_PADDING_OR_HEIGHT: KeyboardBehavior = paddingOrHeightBehavior();
