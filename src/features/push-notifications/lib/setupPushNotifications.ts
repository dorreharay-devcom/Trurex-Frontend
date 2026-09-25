import * as Notifications from 'expo-notifications';
import { isAndroid, isWeb } from '~/shared/lib/ui/platform';

let setupPromise: Promise<void> | null = null;

export function setupPushNotifications(): Promise<void> {
  if (setupPromise) return setupPromise;

  if (isWeb) {
    setupPromise = Promise.resolve();
    return setupPromise;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  setupPromise = isAndroid
    ? Notifications.setNotificationChannelAsync('default-v2', {
        name: 'Default',
        importance: Notifications.AndroidImportance.DEFAULT,
        enableVibrate: true,
        vibrationPattern: [0, 250, 250, 250],
      }).then(() => undefined)
    : Promise.resolve();

  return setupPromise;
}
