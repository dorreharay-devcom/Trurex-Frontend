import NetInfo from '@react-native-community/netinfo';
import { focusManager, onlineManager } from '@tanstack/react-query';
import { AppState, Platform, type AppStateStatus } from 'react-native';

function isOnlineState(state: {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
}): boolean {
  if (state.isConnected === false) return false;
  if (state.isInternetReachable === false) return false;
  return true;
}

export function setupQueryNetwork(): void {
  onlineManager.setEventListener((setOnline) => {
    return NetInfo.addEventListener((state) => {
      setOnline(isOnlineState(state));
    });
  });

  if (Platform.OS === 'web') return;

  focusManager.setEventListener((handleFocus) => {
    const onChange = (status: AppStateStatus) => {
      handleFocus(status === 'active');
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  });
}
