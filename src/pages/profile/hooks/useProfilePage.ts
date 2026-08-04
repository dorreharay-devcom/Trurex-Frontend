import { useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { parseProfileRouteSlug } from '~/features/profile/lib/handle';
import { useRexPreview } from '~/features/rex-detail/hooks/useRexPreview';
import { toUserRoute } from '~/shared/config/routes';
import { TAB, type Tab } from '~/shared/config/mainTabs';
import { openMainTab } from '~/shared/lib/mainTab';

export function useProfilePage() {
  const { userId: slug } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();
  const preview = useRexPreview();
  const target = parseProfileRouteSlug(slug);

  const goToTab = useCallback(
    (tab: Tab) => {
      openMainTab(router, tab);
    },
    [router],
  );

  const goBack = useCallback(() => {
    openMainTab(router, TAB.profile);
  }, [router]);

  const openUser = useCallback(
    (userId: string) => {
      router.replace(toUserRoute(userId));
    },
    [router],
  );

  return {
    userId: target.userId,
    handle: target.handle,
    preview,
    goToTab,
    goBack,
    openUser,
  };
}
