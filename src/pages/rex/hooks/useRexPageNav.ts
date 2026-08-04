import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { TAB } from '~/shared/config/mainTabs';
import { toRexRoute, toUserRoute } from '~/shared/config/routes';
import { openMainTab } from '~/shared/lib/mainTab';
import type { RecommendationOpenOptions } from '~/shared/types/recommendation';

export function useRexPageNav() {
  const router = useRouter();

  const goToDiscover = useCallback(() => {
    openMainTab(router, TAB.discover);
  }, [router]);

  const openUser = useCallback(
    (userId: string) => {
      router.replace(toUserRoute(userId));
    },
    [router],
  );

  const openRex = useCallback(
    (rexId: string, options?: RecommendationOpenOptions) => {
      router.push(toRexRoute(rexId, options));
    },
    [router],
  );

  return { goToDiscover, openUser, openRex };
}
