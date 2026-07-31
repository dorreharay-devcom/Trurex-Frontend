import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Routes, toRexRoute, toUserRoute } from '~/shared/config/routes';
import type { RecommendationOpenOptions } from '~/shared/types/recommendation';

export function useDeepLinkNav() {
  const router = useRouter();

  const goToDiscover = useCallback(() => {
    router.replace(Routes.Main);
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
