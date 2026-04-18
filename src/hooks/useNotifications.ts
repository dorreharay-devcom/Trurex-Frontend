import { useCallback, useMemo, useState } from 'react';
import { getMockNotificationsDemo } from '~/data/mockNotificationsDemo';
import type { AppNotification } from '~/types/notification/appNotification';

export const USE_MOCK_NOTIFICATIONS = true;

function cloneNotifications(list: AppNotification[]): AppNotification[] {
  return list.map((n) => ({ ...n, data: n.data ? { ...n.data } : null }));
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    USE_MOCK_NOTIFICATIONS ? cloneNotifications(getMockNotificationsDemo()) : [],
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications],
  );

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  }, []);

  const refetch = useCallback(async () => {
    if (USE_MOCK_NOTIFICATIONS) {
      setNotifications(cloneNotifications(getMockNotificationsDemo()));
    }
  }, []);

  return {
    notifications,
    unreadCount,
    loading: false,
    markAllAsRead,
    refetch,
  };
}
