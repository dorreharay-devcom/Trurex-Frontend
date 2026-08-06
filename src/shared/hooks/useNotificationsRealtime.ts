import { useCallback, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Backend } from '~/shared/api/client';
import { fetchUserNotifications } from '~/shared/api/notificationsApi';
import { NOTIFICATIONS_QUERY_KEY } from '~/shared/config/queryKeys';
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

  useEffect(() => {
    if (!userId) return;

    return subscribeRealtimeWithResume({
      enabled: true,
      createChannel: () =>
        Backend.channel(`notifications:${userId}`).on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'user_notifications',
            filter: `user_id=eq.${userId}`,
          },
          softRefresh,
        ),
      onSoftRefresh: softRefresh,
    });
  }, [userId, softRefresh]);
}
