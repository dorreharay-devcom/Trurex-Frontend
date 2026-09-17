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
    ? Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.DEFAULT,
      }).then(() => undefined)
    : Promise.resolve();

  return setupPromise;
}
