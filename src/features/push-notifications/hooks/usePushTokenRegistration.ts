import { useCallback, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { registerPushToken } from '~/features/push-notifications/api/pushTokensApi';
import { requestExpoPushToken } from '~/features/push-notifications/lib/pushToken';
import { rememberPushToken } from '~/features/push-notifications/lib/rememberedPushToken';
import { isAndroid, isWeb } from '~/shared/lib/ui/platform';
import { track, AnalyticsEvent } from '~/shared/lib/analytics/track';

const platform = isAndroid ? 'android' : 'ios';
const REGISTRATION_START_DELAY_MS = 4000;

export function usePushTokenRegistration(userId: string | null | undefined) {
  const registeredForRef = useRef<string | null>(null);
  const lastDeviceTokenRef = useRef<string | null>(null);

  const register = useCallback(async (id: string, token: string) => {
    const key = `${id}:${token}`;
    if (registeredForRef.current === key) return;
    await registerPushToken(token, platform);
    registeredForRef.current = key;
    await rememberPushToken(token);
    track(AnalyticsEvent.PushTokenRegistered, { platform });
  }, []);

  useEffect(() => {
    if (isWeb) return;
    if (!userId) {
      registeredForRef.current = null;
      return;
    }

    let cancelled = false;

    const timer = setTimeout(() => {
      void (async () => {
        const token = await requestExpoPushToken().catch(() => null);
        if (!token || cancelled) return;
        await register(userId, token).catch(() => {});
      })();
    }, REGISTRATION_START_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [userId, register]);

  useEffect(() => {
    if (isWeb || !userId) return;
    const subscription = Notifications.addPushTokenListener((devicePushToken) => {
      const next = String(devicePushToken.data);
      if (lastDeviceTokenRef.current === next) return;
      lastDeviceTokenRef.current = next;
      void (async () => {
        const token = await requestExpoPushToken().catch(() => null);
        if (!token) return;
        await register(userId, token).catch(() => {});
      })();
    });
    return () => subscription.remove();
  }, [userId, register]);
}
