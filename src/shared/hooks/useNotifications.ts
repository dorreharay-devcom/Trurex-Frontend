import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { useAuth } from '~/features/auth/providers';
import {
  fetchUserNotifications,
  markNotificationsRead,
  unreadCountFromNotifications,
} from '~/shared/api/notificationsApi';
import { NOTIFICATIONS_QUERY_KEY } from '~/shared/config/queryKeys';
import type { AppNotification } from '~/shared/types/appNotification';
import { isWeb } from '~/shared/lib/ui/platform';
import { withOnlineMutation } from '~/shared/lib/network/assertOnline';

export function useNotifications() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const {
    data: notifications = [],
    isLoading: loading,
    isError,
    refetch,
  } = useQuery<AppNotification[]>({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: fetchUserNotifications,
    enabled: Boolean(userId),
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (isWeb || !userId) return;
    const onChange = (status: AppStateStatus) => {
      if (status === 'active') void refetch();
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, [refetch, userId]);

  const unreadCount = useMemo(() => unreadCountFromNotifications(notifications), [notifications]);

  const markAllAsReadFn = withOnlineMutation('Notifications', (_: void) => markNotificationsRead());
  const markOneAsReadFn = withOnlineMutation('Notifications', (id: string) =>
    markNotificationsRead([id]),
  );

  const markAllAsRead = useMutation({
    mutationFn: markAllAsReadFn,
    onSuccess: () => {
      queryClient.setQueryData<AppNotification[]>(
        NOTIFICATIONS_QUERY_KEY,
        (prev) => prev?.map((n) => ({ ...n, is_read: true, unread_count: 0 })) ?? [],
      );
    },
  });

  const markOneAsRead = useMutation({
    mutationFn: markOneAsReadFn,
    onSuccess: (_data, id) => {
      queryClient.setQueryData<AppNotification[]>(NOTIFICATIONS_QUERY_KEY, (prev) => {
        if (!prev) return [];
        const next = prev.map((n) => (n.id === id ? { ...n, is_read: true } : n));
        const unread = next.filter((n) => !n.is_read).length;
        return next.map((n) => ({ ...n, unread_count: unread }));
      });
    },
  });

  return {
    notifications,
    unreadCount,
    loading: Boolean(userId) && loading,
    isError: isError && notifications.length === 0,
    markAllAsRead: () => markAllAsRead.mutate(undefined),
    markOneAsRead: (id: string) => markOneAsRead.mutate(id),
    refetch,
  };
}
