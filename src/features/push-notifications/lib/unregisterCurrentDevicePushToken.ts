import { unregisterPushToken } from '~/features/push-notifications/api/pushTokensApi';
import { readExpoPushTokenIfGranted } from '~/features/push-notifications/lib/pushToken';

export async function unregisterCurrentDevicePushToken(): Promise<void> {
  const token = await readExpoPushTokenIfGranted().catch(() => null);
  if (!token) return;
  await unregisterPushToken(token).catch(() => {});
}
