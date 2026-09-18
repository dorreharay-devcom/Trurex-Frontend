import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { setupPushNotifications } from '~/features/push-notifications/lib/setupPushNotifications';
import { withAutoRefreshSuppressed } from '~/shared/api/client';
import { isWeb } from '~/shared/lib/ui/platform';
import { withTimeout } from '~/shared/lib/network/withTimeout';

const PUSH_TOKEN_FETCH_TIMEOUT_MS = 6000;
const PERMISSION_STATUS_TIMEOUT_MS = 5000;
const PERMISSION_REQUEST_TIMEOUT_MS = 60000;

function projectId(): string | null {
  return Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId ?? null;
}

function isPushCapable(): boolean {
  return Constants.expoConfig?.extra?.appEnv === 'production';
}

async function readToken(): Promise<string | null> {
  const id = projectId();
  if (!id) return null;
  await setupPushNotifications();
  const result = await withTimeout(
    Notifications.getExpoPushTokenAsync({ projectId: id }),
    PUSH_TOKEN_FETCH_TIMEOUT_MS,
    null,
  );
  return result?.data ?? null;
}

function getPermissionStatus(): Promise<Notifications.PermissionStatus> {
  return withTimeout(
    Notifications.getPermissionsAsync().then((result) => result.status),
    PERMISSION_STATUS_TIMEOUT_MS,
    Notifications.PermissionStatus.UNDETERMINED,
  );
}

function requestPermissionStatus(): Promise<Notifications.PermissionStatus> {
  return withAutoRefreshSuppressed(() =>
    withTimeout(
      Notifications.requestPermissionsAsync().then((result) => result.status),
      PERMISSION_REQUEST_TIMEOUT_MS,
      Notifications.PermissionStatus.UNDETERMINED,
    ),
  );
}

export async function requestExpoPushToken(): Promise<string | null> {
  if (isWeb || !Device.isDevice || !isPushCapable()) return null;

  await setupPushNotifications();

  let status = await getPermissionStatus();
  if (status !== Notifications.PermissionStatus.GRANTED) {
    status = await requestPermissionStatus();
  }
  if (status !== Notifications.PermissionStatus.GRANTED) return null;

  return readToken();
}

export async function readExpoPushTokenIfGranted(): Promise<string | null> {
  if (isWeb || !Device.isDevice || !isPushCapable()) return null;

  const status = await getPermissionStatus();
  if (status !== Notifications.PermissionStatus.GRANTED) return null;

  return readToken();
}
