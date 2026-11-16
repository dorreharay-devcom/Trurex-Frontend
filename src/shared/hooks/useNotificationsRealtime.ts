import { useCallback, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Backend } from '~/shared/api/client';
import { fetchUserNotifications } from '~/shared/api/notificationsApi';
import { NOTIFICATIONS_QUERY_KEY } from '~/shared/config/queryKeys';
import { refreshQueriesForNotification } from '~/shared/lib/notification/refresh';
import { subscribeRealtimeWithResume } from '~/shared/lib/realtime/subscribeWithResume';

export function useNotificationsRealtime(userId: string | null | undefined) {
  const queryClient = useQueryClient();

  useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: fetchUserNotifications,
    enabled: Boolean(userId),
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });

  const softRefresh = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
  }, [queryClient]);

  const onInsert = useCallback(
    (payload: { new: Record<string, unknown> }) => {
      softRefresh();
      refreshQueriesForNotification(queryClient, payload.new.type);
    },
    [queryClient, softRefresh],
  );

  useEffect(() => {
    if (!userId) return;

    return subscribeRealtimeWithResume({
      enabled: true,
      topic: `notifications:${userId}`,
      createChannel: () =>
        Backend.channel(`notifications:${userId}`).on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'user_notifications',
            filter: `user_id=eq.${userId}`,
          },
          onInsert,
        ),
      onSoftRefresh: softRefresh,
    });
  }, [userId, onInsert, softRefresh]);
}
