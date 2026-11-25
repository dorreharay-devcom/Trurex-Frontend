import { useCallback, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  BUSINESS_PROFILE_VIEW,
  parseBusinessProfileViewParam,
  type BusinessProfileView,
} from '~/features/business-account/config/businessProfileView';
import { useAccountMode } from '~/features/business-account/hooks/useAccountMode';
import { firstRouteParam } from '~/shared/lib/navigation/routeIds';

export function useProfileBusinessView(isOwnProfile: boolean) {
  const router = useRouter();
  const params = useLocalSearchParams<{ view?: string | string[] }>();
  const { isBusinessMode } = useAccountMode();

  const view = useMemo(
    () => parseBusinessProfileViewParam(firstRouteParam(params.view)),
    [params.view],
  );

  const setView = useCallback(
    (next: BusinessProfileView) => {
      router.setParams({ view: next });
    },
    [router],
  );

  const active = isOwnProfile && isBusinessMode;
  const showMyBusinessPage = active && view === BUSINESS_PROFILE_VIEW.page;

  return {
    active,
    view,
    setView,
    showMyBusinessPage,
    showContentTabs: !showMyBusinessPage,
  };
}
