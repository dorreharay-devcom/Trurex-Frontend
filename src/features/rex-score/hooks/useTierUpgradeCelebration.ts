import { useCallback, useEffect, useState } from 'react';
import { Backend } from '~/shared/api/client';
import { subscribeRealtimeWithResume } from '~/shared/lib/realtime/subscribeWithResume';
import { ProfileApi } from '~/features/profile/api/profileApi';
import { useRexScoreTiers } from '~/features/rex-score/hooks/useRexScoreTiers';
import { NOTIFICATION_TYPE } from '~/shared/config/notificationTypes';
import type { RexScoreTier } from '~/features/rex-score/types/rexScoreTier';

export function useTierUpgradeCelebration(userId: string | null | undefined) {
  const { getTier, isTopTier } = useRexScoreTiers();
  const [tier, setTier] = useState<RexScoreTier | null>(null);

  const handleUpgrade = useCallback(async () => {
    if (!userId) return;
    const row = await ProfileApi.getCurrentUser(userId).catch(() => null);
    const resolved = getTier(row?.rex_tier ?? null);
    if (resolved) setTier(resolved);
  }, [userId, getTier]);

  useEffect(() => {
    if (!userId) return;

    return subscribeRealtimeWithResume({
      enabled: true,
      createChannel: () =>
        Backend.channel(`tier-upgrade:${userId}`).on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'user_notifications',
            filter: `user_id=eq.${userId}`,
          },
          (payload: { new?: { type?: string } }) => {
            if (payload.new?.type === NOTIFICATION_TYPE.tier_upgrade) {
              void handleUpgrade();
            }
          },
        ),
      onSoftRefresh: () => {},
    });
  }, [userId, handleUpgrade]);

  const dismiss = useCallback(() => setTier(null), []);

  return { tier, isTopTier: isTopTier(tier?.code), dismiss };
}
