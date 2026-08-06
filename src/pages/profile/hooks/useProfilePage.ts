import { useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { parseProfileRouteSlug } from '~/features/profile/lib/handle';
import { TAB, type Tab } from '~/shared/config/mainTabs';
import { toUserRoute } from '~/shared/config/routes';
import { openMainTab } from '~/shared/lib/mainTab';
import { openRecommendation, openRex } from '~/shared/lib/navigation/createRex';
import type { Recommendation, RecommendationOpenOptions } from '~/shared/types/recommendation';

export function useProfilePage() {
  const { userId: slug } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();
  const target = parseProfileRouteSlug(slug);

  const goToTab = useCallback(
    (tab: Tab) => {
      openMainTab(router, tab);
    },
    [router],
  );

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    openMainTab(router, TAB.profile);
  }, [router]);

  const openUser = useCallback(
    (userId: string) => {
      router.replace(toUserRoute(userId));
    },
    [router],
  );

  const handleOpenRex = useCallback(
    (rexId: string, options?: RecommendationOpenOptions) => {
      openRex(router, rexId, options);
    },
    [router],
  );

  const handleOpenRecommendation = useCallback(
    (rec: Recommendation, options?: RecommendationOpenOptions) => {
      openRecommendation(router, rec, options);
    },
    [router],
  );

  return {
    router,
    userId: target.userId,
    handle: target.handle,
    goToTab,
    goBack,
    openUser,
    openRex: handleOpenRex,
    openRecommendation: handleOpenRecommendation,
  };
}
