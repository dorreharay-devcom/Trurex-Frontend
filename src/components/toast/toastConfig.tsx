import { Platform, Pressable, StyleSheet } from 'react-native';
import {
  ErrorToast,
  InfoToast,
  SuccessToast,
  type BaseToastProps,
  type ToastConfigParams,
} from 'react-native-toast-message';
import { X } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';

export type AppToastRendererProps = ToastConfigParams<unknown> & Pick<BaseToastProps, 'style'>;

export const toastRowStyle = {
  alignSelf: 'flex-end' as const,
  height: 'auto' as const,
  marginRight: 16,
  minHeight: 64,
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

const toastTextStyles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 10,
  },
  title: {
    flexWrap: 'wrap',
  },
  message: {
    flexWrap: 'wrap',
    lineHeight: 16,
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
      renderTrailingIcon={
        Platform.OS === 'web' ? () => <ToastDismissButton hide={props.hide} /> : undefined
      }
      contentContainerStyle={toastTextStyles.contentContainer}
      style={[toastRowStyle, props.style]}
      text1NumberOfLines={3}
      text1Style={toastTextStyles.title}
      text2NumberOfLines={8}
      text2Style={toastTextStyles.message}
    />
  );
}

export const appToastConfig = {
  success: (props: AppToastRendererProps) => renderToastRow(SuccessToast, props),
  error: (props: AppToastRendererProps) => renderToastRow(ErrorToast, props),
  info: (props: AppToastRendererProps) => renderToastRow(InfoToast, props),
};
