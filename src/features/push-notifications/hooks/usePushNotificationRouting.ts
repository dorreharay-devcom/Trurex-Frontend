import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { resolvePushNotificationHref } from '~/features/push-notifications/lib/pushNotificationTarget';
import { NOTIFICATIONS_QUERY_KEY } from '~/shared/config/queryKeys';
import { isWeb } from '~/shared/lib/ui/platform';
import { track, AnalyticsEvent } from '~/shared/lib/analytics/track';

export function usePushNotificationRouting() {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isWeb) return;

    const openFromResponse = (response: Notifications.NotificationResponse | null) => {
      if (!response) return;
      const data = response.notification.request.content.data as
        | Record<string, unknown>
        | undefined;
      const href = resolvePushNotificationHref(data);
      if (!href) return;
      track(AnalyticsEvent.PushNotificationTapped, { type: String(data?.type ?? '') });
      router.push(href);
    };

    void Notifications.getLastNotificationResponseAsync().then(openFromResponse);

    const tapSubscription = Notifications.addNotificationResponseReceivedListener(openFromResponse);

    const receivedSubscription = Notifications.addNotificationReceivedListener(() => {
      void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    });

    return () => {
      tapSubscription.remove();
      receivedSubscription.remove();
    };
  }, [router, queryClient]);
}
