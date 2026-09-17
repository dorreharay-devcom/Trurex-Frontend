import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { registerPushToken } from '~/features/push-notifications/api/pushTokensApi';
import { requestExpoPushToken } from '~/features/push-notifications/lib/pushToken';
import { isAndroid, isWeb } from '~/shared/lib/ui/platform';
import { track, AnalyticsEvent } from '~/shared/lib/analytics/track';

const platform = isAndroid ? 'android' : 'ios';
const REGISTRATION_START_DELAY_MS = 4000;

export function usePushTokenRegistration(userId: string | null | undefined) {
  const registeredForRef = useRef<string | null>(null);

  useEffect(() => {
    if (isWeb) return;
    if (!userId) {
      registeredForRef.current = null;
      return;
    }
    if (registeredForRef.current === userId) return;

    let cancelled = false;

    const timer = setTimeout(() => {
      void (async () => {
        const token = await requestExpoPushToken().catch(() => null);
        if (!token || cancelled) return;
        try {
          await registerPushToken(token, platform);
          registeredForRef.current = userId;
          track(AnalyticsEvent.PushTokenRegistered, { platform });
        } catch {}
      })();
    }, REGISTRATION_START_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [userId]);

  useEffect(() => {
    if (isWeb) return;
    const subscription = Notifications.addPushTokenListener(() => {
      if (!userId) return;
      void requestExpoPushToken()
        .then((token) => (token ? registerPushToken(token, platform) : undefined))
        .catch(() => {});
    });
    return () => subscription.remove();
  }, [userId]);
}
