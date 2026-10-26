import { useCallback } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import type { NavigationState } from '@react-navigation/native';
import { useAuth } from '~/features/auth/providers';
import { TAB, type Tab } from '~/shared/config/mainTabs';
import { Routes, toBusinessRoute, toRexRoute, toUserRoute } from '~/shared/config/routes';
import { openMainTab } from '~/shared/lib/mainTab';
import type { RecommendationOpenOptions } from '~/shared/types/recommendation';

function isPreviousRouteUserProfile(state: NavigationState | undefined, userId: string): boolean {
  const previous = state?.routes[state.index - 1];
  const params = previous?.params as { userId?: string } | undefined;
  return previous?.name === 'user/[userId]' && params?.userId === userId;
}

export function useRexPageNav() {
  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useAuth();
  const currentUserId = user?.id;

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
      if (userId === currentUserId) {
        router.dismissTo(Routes.Profile);
        return;
      }
      router.push(toUserRoute(userId));
    },
    [router, currentUserId],
  );

  const openAuthor = useCallback(
    (authorId: string) => {
      if (authorId === currentUserId) {
        router.dismissTo(Routes.Profile);
        return;
      }
      const returnsToAuthor = isPreviousRouteUserProfile(navigation.getState(), authorId);
      closeRex();
      if (!returnsToAuthor) router.push(toUserRoute(authorId));
    },
    [router, navigation, currentUserId, closeRex],
  );

  const openRex = useCallback(
    (rexId: string, options?: RecommendationOpenOptions) => {
      router.push(toRexRoute(rexId, options));
    },
    [router],
  );

  const openBusinessPage = useCallback(
    (rexId: string) => {
      router.push(toBusinessRoute(rexId));
    },
    [router],
  );

  return {
    router,
    closeRex,
    goToDiscover,
    changeTab,
    openUser,
    openAuthor,
    openRex,
    openBusinessPage,
  };
}
