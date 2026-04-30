import { Pressable } from 'react-native';
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

export function ToastDismissButton({ hide }: Pick<AppToastRendererProps, 'hide'>) {
  return (
    <Pressable
      onPress={() => hide()}
      hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      accessibilityRole="button"
      accessibilityLabel="Dismiss notification"
      style={{
        alignSelf: 'flex-start',
        marginTop: 10,
        marginRight: 12,
        paddingLeft: 6,
        paddingBottom: 4,
      }}
    >
      <X size={12} color={Theme.colors.muted} strokeWidth={2} />
    </Pressable>
  );
}

function trailingDismiss(props: AppToastRendererProps) {
  return () => <ToastDismissButton hide={props.hide} />;
}

export const appToastConfig = {
  success: (props: AppToastRendererProps) => (
    <SuccessToast
      {...props}
      renderTrailingIcon={trailingDismiss(props)}
      style={[toastRowStyle, props.style]}
    />
  ),
  error: (props: AppToastRendererProps) => (
    <ErrorToast
      {...props}
      renderTrailingIcon={trailingDismiss(props)}
      style={[toastRowStyle, props.style]}
    />
  ),
  info: (props: AppToastRendererProps) => (
    <InfoToast
      {...props}
      renderTrailingIcon={trailingDismiss(props)}
      style={[toastRowStyle, props.style]}
    />
  ),
};
