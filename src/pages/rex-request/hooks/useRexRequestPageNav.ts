import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { TAB, type Tab } from '~/shared/config/mainTabs';
import { toRexRoute, toUserRoute } from '~/shared/config/routes';
import { openMainTab } from '~/shared/lib/mainTab';
import { openCreateRexRequest } from '~/shared/lib/navigation/rexRequest';
import type { RecommendationOpenOptions } from '~/shared/types/recommendation';
import type { UserProfileOpenOptions } from '~/shared/types/userProfileOpen';

export function useRexRequestPageNav() {
  const router = useRouter();

  const closeRexRequest = useCallback(() => {
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
    (userId: string, options?: UserProfileOpenOptions) => {
      router.push(toUserRoute(userId, options));
    },
    [router],
  );

  const openRex = useCallback(
    (rexId: string, options?: RecommendationOpenOptions) => {
      router.push(toRexRoute(rexId, options));
    },
    [router],
  );

  const openEditRexRequest = useCallback(
    (requestId: string) => {
      openCreateRexRequest(router, { editRequestId: requestId });
    },
    [router],
  );

  return {
    router,
    closeRexRequest,
    goToDiscover,
    changeTab,
    openUser,
    openRex,
    openEditRexRequest,
  };
}
