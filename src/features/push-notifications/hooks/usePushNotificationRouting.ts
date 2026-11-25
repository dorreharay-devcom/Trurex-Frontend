import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import {
  ensureAccountMode,
  fetchFreshMyProfiles,
} from '~/features/business-account/lib/accountModeSwitch';
import {
  resolvePushAccountMode,
  resolvePushNotificationHref,
} from '~/features/push-notifications/lib/pushNotificationTarget';
import { Auth } from '~/shared/api/client';
import { NOTIFICATIONS_QUERY_KEY } from '~/shared/config/queryKeys';
import { refreshQueriesForNotification } from '~/shared/lib/notification/refresh';
import { isWeb } from '~/shared/lib/ui/platform';
import { track, AnalyticsEvent } from '~/shared/lib/analytics/track';

function notificationData(notification: Notifications.Notification) {
  return notification.request.content.data as Record<string, unknown> | undefined;
}

export function usePushNotificationRouting() {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isWeb) return;

    const actAsAddressedProfile = async (data: Record<string, unknown> | undefined) => {
      const { data: session } = await Auth.getSession();
      const userId = session.session?.user.id;
      if (!userId) return;
      const profiles = await fetchFreshMyProfiles(queryClient, userId).catch(() => []);
      const mode = resolvePushAccountMode(data, profiles);
      if (mode) ensureAccountMode(queryClient, userId, profiles, mode);
    };

    const openFromResponse = async (response: Notifications.NotificationResponse | null) => {
      if (!response) return;
      const data = notificationData(response.notification);
      refreshQueriesForNotification(queryClient, data?.type);
      const href = resolvePushNotificationHref(data);
      if (!href) return;
      track(AnalyticsEvent.PushNotificationTapped, { type: String(data?.type ?? '') });
      await actAsAddressedProfile(data);
      router.push(href);
    };

    void Notifications.getLastNotificationResponseAsync().then(openFromResponse);

    const tapSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => void openFromResponse(response),
    );

    const receivedSubscription = Notifications.addNotificationReceivedListener((notification) => {
      void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      refreshQueriesForNotification(queryClient, notificationData(notification)?.type);
    });

    return () => {
      tapSubscription.remove();
      receivedSubscription.remove();
    };
  }, [router, queryClient]);
}
