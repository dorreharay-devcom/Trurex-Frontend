import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { isWeb } from '~/shared/lib/ui/platform';

function projectId(): string | null {
  return Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId ?? null;
}

async function readToken(): Promise<string | null> {
  const id = projectId();
  if (!id) return null;
  const { data } = await Notifications.getExpoPushTokenAsync({ projectId: id });
  return data;
}

export async function requestExpoPushToken(): Promise<string | null> {
  if (isWeb || !Device.isDevice) return null;

  const existing = await Notifications.getPermissionsAsync();
  let status = existing.status;
  if (status !== 'granted') {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }
  if (status !== 'granted') return null;

  return readToken();
}

export async function readExpoPushTokenIfGranted(): Promise<string | null> {
  if (isWeb || !Device.isDevice) return null;

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') return null;

  return readToken();
}
