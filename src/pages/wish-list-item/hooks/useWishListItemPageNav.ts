import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { TAB, type Tab } from '~/shared/config/mainTabs';
import { toRexRoute } from '~/shared/config/routes';
import { openMainTab } from '~/shared/lib/mainTab';
import type { RecommendationOpenOptions } from '~/shared/types/recommendation';

export function useWishListItemPageNav() {
  const router = useRouter();

  const closeItem = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    openMainTab(router, TAB.faves);
  }, [router]);

  const goToGems = useCallback(() => {
    openMainTab(router, TAB.faves);
  }, [router]);

  const changeTab = useCallback(
    (tab: Tab) => {
      openMainTab(router, tab);
    },
    [router],
  );

  const openRex = useCallback(
    (rexId: string, options?: RecommendationOpenOptions) => {
      router.push(toRexRoute(rexId, options));
    },
    [router],
  );

  return { router, closeItem, goToGems, changeTab, openRex };
}
