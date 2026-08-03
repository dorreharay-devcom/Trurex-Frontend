import Toast from 'react-native-toast-message';

const base = {
  position: 'bottom' as const,
  visibilityTime: 3200,
  bottomOffset: 40,
};

export function toastSuccess(title: string, message?: string) {
  Toast.show({
    type: 'success',
    text1: title,
    text2: message,
    ...base,
  });
}

export function toastError(title: string, message?: string) {
  Toast.show({
    type: 'error',
    text1: title,
    text2: message,
    ...base,
    visibilityTime: 4500,
  });
}

export function toastInfo(title: string, message?: string) {
  Toast.show({
    type: 'info',
    text1: title,
    text2: message,
    ...base,
  });
}

const MODAL_DISMISS_TOAST_DELAY_MS = 320;

function toastAfterDismiss(onDismiss: () => void, show: () => void) {
  onDismiss();
  setTimeout(show, MODAL_DISMISS_TOAST_DELAY_MS);
}

export function toastSuccessAfterDismiss(onDismiss: () => void, title: string, message?: string) {
  toastAfterDismiss(onDismiss, () => toastSuccess(title, message));
}

export function toastErrorAfterDismiss(onDismiss: () => void, title: string, message?: string) {
  toastAfterDismiss(onDismiss, () => toastError(title, message));
}
