import Toast from 'react-native-toast-message';
import { appToastConfig } from './toastConfig';

export function AppToast() {
  return <Toast config={appToastConfig} />;
}
