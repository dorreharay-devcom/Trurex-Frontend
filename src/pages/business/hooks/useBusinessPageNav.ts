import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { TAB, type Tab } from '~/shared/config/mainTabs';
import { toRexRoute } from '~/shared/config/routes';
import { openMainTab } from '~/shared/lib/mainTab';

export function useBusinessPageNav() {
  const router = useRouter();

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    openMainTab(router, TAB.discover);
  }, [router]);

  const goToDiscover = useCallback(() => {
    openMainTab(router, TAB.discover);
  }, [router]);

  const openRex = useCallback(
    (rexId: string) => {
      router.push(toRexRoute(rexId));
    },
    [router],
  );

  const changeTab = useCallback(
    (tab: Tab) => {
      openMainTab(router, tab);
    },
    [router],
  );

  return { goBack, goToDiscover, openRex, changeTab };
}
