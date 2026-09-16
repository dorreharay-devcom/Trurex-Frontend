import NetInfo from '@react-native-community/netinfo';
import { focusManager, onlineManager } from '@tanstack/react-query';
import { AppState, Platform, type AppStateStatus } from 'react-native';
import { isOnlineState } from '~/shared/lib/query/isOnlineState';

export function setupQueryNetwork(): void {
  onlineManager.setEventListener((setOnline) => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setOnline(isOnlineState(state));
    });

    if (Platform.OS === 'web') return unsubscribe;

    const onAppStateChange = (status: AppStateStatus) => {
      if (status !== 'active') return;
      void NetInfo.refresh().then((state) => {
        setOnline(isOnlineState(state));
      });
    };

    const appStateSub = AppState.addEventListener('change', onAppStateChange);
    return () => {
      unsubscribe();
      appStateSub.remove();
    };
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
