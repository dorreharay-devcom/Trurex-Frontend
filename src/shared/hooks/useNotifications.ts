import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { Backend, unwrap } from '~/shared/api/client';
import { throwRpcIfFailed } from '~/shared/lib/errors/restriction';
import type { AppNotification } from '~/shared/types/appNotification';
import { isWeb } from '~/shared/lib/ui/platform';
import { withOnlineMutation } from '~/shared/lib/network/assertOnline';

async function fetchNotifications(): Promise<AppNotification[]> {
  const raw = unwrap(
    await Backend.rpc('user_notifications', { result_limit: 50, result_offset: 0 }),
  );
  if (!Array.isArray(raw)) return [];
  return raw as AppNotification[];
}

async function markNotificationsRead(ids?: string[]): Promise<void> {
  const params = ids?.length ? { input_ids: ids } : {};
  throwRpcIfFailed(await Backend.rpc('mark_notifications_read', params));
}

export function useNotifications() {
  const queryClient = useQueryClient();

  const {
    data: notifications = [],
    isLoading: loading,
    isError,
    refetch,
  } = useQuery<AppNotification[]>({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (isWeb) return;
    const onChange = (status: AppStateStatus) => {
      if (status === 'active') void refetch();
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, [refetch]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications],
  );

  const markAllAsReadFn = withOnlineMutation('Notifications', (_: void) => markNotificationsRead());
  const markOneAsReadFn = withOnlineMutation('Notifications', (id: string) =>
    markNotificationsRead([id]),
  );

  const markAllAsRead = useMutation({
    mutationFn: markAllAsReadFn,
    onSuccess: () => {
      queryClient.setQueryData<AppNotification[]>(
        ['notifications'],
        (prev) => prev?.map((n) => ({ ...n, is_read: true })) ?? [],
      );
    },
  });

  const markOneAsRead = useMutation({
    mutationFn: markOneAsReadFn,
    onSuccess: (_data, id) => {
      queryClient.setQueryData<AppNotification[]>(
        ['notifications'],
        (prev) => prev?.map((n) => (n.id === id ? { ...n, is_read: true } : n)) ?? [],
      );
    },
  });

  return {
    notifications,
    unreadCount,
    loading,
    isError: isError && notifications.length === 0,
    markAllAsRead: () => markAllAsRead.mutate(undefined),
    markOneAsRead: (id: string) => markOneAsRead.mutate(id),
    refetch,
  };
}
