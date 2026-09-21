import { unregisterPushToken } from '~/features/push-notifications/api/pushTokensApi';
import { readExpoPushTokenIfGranted } from '~/features/push-notifications/lib/pushToken';
import {
  forgetPushToken,
  readRememberedPushToken,
} from '~/features/push-notifications/lib/rememberedPushToken';

export async function unregisterCurrentDevicePushToken(): Promise<void> {
  const token =
    (await readRememberedPushToken()) ?? (await readExpoPushTokenIfGranted().catch(() => null));
  if (!token) return;
  await unregisterPushToken(token).catch(() => {});
  await forgetPushToken();
}
