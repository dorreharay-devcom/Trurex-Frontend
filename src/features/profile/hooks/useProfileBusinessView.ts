import { useCallback, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { AccountKind } from '~/features/business-account/config/accountKind';
import {
  BUSINESS_PROFILE_VIEW,
  parseBusinessProfileViewParam,
  type BusinessProfileView,
} from '~/features/business-account/config/businessProfileView';
import { useAccountMode } from '~/features/business-account/hooks/useAccountMode';
import { resolveProfileFace } from '~/features/business-account/lib/profileFace';
import { firstRouteParam } from '~/shared/lib/navigation/routeIds';

type Params = {
  isOwnProfile: boolean;
  profileKind: AccountKind | null;
  asBusiness: boolean;
};

export function useProfileBusinessView({ isOwnProfile, profileKind, asBusiness }: Params) {
  const router = useRouter();
  const params = useLocalSearchParams<{ view?: string | string[] }>();
  const own = useAccountMode();

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

  const face = resolveProfileFace({
    kind: isOwnProfile ? own.kind : profileKind,
    businessRequested: isOwnProfile ? own.isBusinessMode : asBusiness,
  });
  const active = isOwnProfile && own.isBusinessMode;
  const showMyBusinessPage = active && view === BUSINESS_PROFILE_VIEW.page;

  return {
    active,
    canSwitch: isOwnProfile && own.canSwitch,
    mode: own.mode,
    setMode: own.setMode,
    view,
    setView,
    showMyBusinessPage,
    showContentTabs: !showMyBusinessPage,
    businessFace: face.businessFace,
    postedAsBusinessFilter: face.postedAsBusinessFilter,
    contentReady: isOwnProfile ? !own.isLoading : profileKind != null,
  };
}
