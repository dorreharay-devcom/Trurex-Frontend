import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { usePlaceBusinessPage } from '~/features/business/hooks/usePlaceBusinessPage';
import { placeIdRef } from '~/features/business/lib/placeRef';
import { useBusinessAccount } from '~/features/business-account/hooks/useBusinessAccount';
import { useBusinessClaimFlow } from '~/features/business-account/hooks/useBusinessClaimFlow';
import { useBusinessProfile } from '~/features/business-account/hooks/useBusinessProfile';
import { resolveMyBusinessPageState } from '~/features/business-account/lib/businessPageState';
import { Routes, toRexRoute } from '~/shared/config/routes';

export function useMyBusinessPage() {
  const router = useRouter();
  const { claimStatus } = useBusinessAccount();
  const profile = useBusinessProfile();
  const placeId = profile.data?.placeId ?? null;
  const page = usePlaceBusinessPage(placeIdRef(placeId));
  const claim = useBusinessClaimFlow();

  const state = resolveMyBusinessPageState({
    claimStatus,
    placeId,
    summary: {
      isPending: page.summary.isPending,
      isError: page.summary.isError,
      isVisible: page.summary.data?.is_visible_business_page === true,
    },
  });

  const openEdit = useCallback(() => {
    router.push(Routes.ProfileEditBusiness);
  }, [router]);

  const openRex = useCallback(
    (rexId: string) => {
      router.push(toRexRoute(rexId));
    },
    [router],
  );

  const { refetch: refetchSummary } = page.summary;
  const retry = useCallback(() => {
    void refetchSummary();
  }, [refetchSummary]);

  return { state, profile: profile.data ?? null, page, claim, openEdit, openRex, retry };
}
