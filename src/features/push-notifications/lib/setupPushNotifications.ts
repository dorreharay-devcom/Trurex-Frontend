import * as Notifications from 'expo-notifications';
import { isAndroid, isWeb } from '~/shared/lib/ui/platform';

let didSetup = false;

export function setupPushNotifications(): void {
  if (isWeb || didSetup) return;
  didSetup = true;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  if (isAndroid) {
    void Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}
