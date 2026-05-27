import { Pressable, StyleSheet } from 'react-native';
import {
  ErrorToast,
  InfoToast,
  SuccessToast,
  type BaseToastProps,
  type ToastConfigParams,
} from 'react-native-toast-message';
import { X } from 'lucide-react-native';
import { Theme } from '~/theme/Theme';

export type AppToastRendererProps = ToastConfigParams<unknown> & Pick<BaseToastProps, 'style'>;

export const toastRowStyle = {
  alignSelf: 'flex-end' as const,
  marginRight: 16,
  borderLeftColor: Theme.colors.primary,
};

type ToastRowComponent = typeof SuccessToast | typeof ErrorToast | typeof InfoToast;

const dismissHitSlop = { top: 10, right: 10, bottom: 10, left: 10 } as const;

const dismissStyles = StyleSheet.create({
  root: {
    alignItems: 'center',
    alignSelf: 'stretch',
    height: 44,
    justifyContent: 'center',
    marginRight: 2,
    width: 44,
    zIndex: 2,
    elevation: 2,
  },
});

export function ToastDismissButton({ hide }: Pick<AppToastRendererProps, 'hide'>) {
  return (
    <Pressable
      onPress={() => hide()}
      onPressIn={() => hide()}
      hitSlop={dismissHitSlop}
      accessibilityRole="button"
      accessibilityLabel="Dismiss notification"
      style={dismissStyles.root}
    >
      <X size={12} color={Theme.colors.muted} strokeWidth={2} />
    </Pressable>
  );
}

function renderToastRow(Row: ToastRowComponent, props: AppToastRendererProps) {
  return (
    <Row
      {...props}
      renderTrailingIcon={() => <ToastDismissButton hide={props.hide} />}
      style={[toastRowStyle, props.style]}
    />
  );
}

export const appToastConfig = {
  success: (props: AppToastRendererProps) => renderToastRow(SuccessToast, props),
  error: (props: AppToastRendererProps) => renderToastRow(ErrorToast, props),
  info: (props: AppToastRendererProps) => renderToastRow(InfoToast, props),
};
