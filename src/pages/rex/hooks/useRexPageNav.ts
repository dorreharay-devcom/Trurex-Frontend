import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { TAB, type Tab } from '~/shared/config/mainTabs';
import { toRexRoute, toUserRoute } from '~/shared/config/routes';
import { openMainTab } from '~/shared/lib/mainTab';
import type { RecommendationOpenOptions } from '~/shared/types/recommendation';

export function useRexPageNav() {
  const router = useRouter();

  const closeRex = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    openMainTab(router, TAB.discover);
  }, [router]);

  const goToDiscover = useCallback(() => {
    openMainTab(router, TAB.discover);
  }, [router]);

  const changeTab = useCallback(
    (tab: Tab) => {
      openMainTab(router, tab);
    },
    [router],
  );

  const openUser = useCallback(
    (userId: string) => {
      router.push(toUserRoute(userId));
    },
    [router],
  );

  const openRex = useCallback(
    (rexId: string, options?: RecommendationOpenOptions) => {
      router.push(toRexRoute(rexId, options));
    },
    [router],
  );

  return { router, closeRex, goToDiscover, changeTab, openUser, openRex };
}
