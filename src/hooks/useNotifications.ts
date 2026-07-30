import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Backend, unwrap } from '~/shared/api/client';
import { throwRpcIfFailed } from '~/utils/mutationRestrictionError';
import type { AppNotification } from '~/types/notification/appNotification';

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
    refetch,
  } = useQuery<AppNotification[]>({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    staleTime: 30_000,
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAllAsRead = useMutation({
    mutationFn: () => markNotificationsRead(),
    onSuccess: () => {
      queryClient.setQueryData<AppNotification[]>(
        ['notifications'],
        (prev) => prev?.map((n) => ({ ...n, is_read: true })) ?? [],
      );
    },
  });

  const markOneAsRead = useMutation({
    mutationFn: (id: string) => markNotificationsRead([id]),
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
    markAllAsRead: () => markAllAsRead.mutate(),
    markOneAsRead: (id: string) => markOneAsRead.mutate(id),
    refetch,
  };
}
