import React, { useCallback } from 'react';
import { useRouter } from 'expo-router';
import DeepLinkShell from '~/shared/ui/DeepLinkShell';
import ProtectedRoute from '~/components/common/ProtectedRoute';
import RecommendationDetailModal from '~/features/rex-detail/ui/RecommendationDetailModal';
import { TAB } from '~/components/layout/TabBar';
import { Routes, toRexRoute, toUserRoute } from '~/shared/config/routes';
import { useRexDeepLink } from '~/pages/rex-deep-link/hooks/useRexDeepLink';
import RexDeepLinkBody from '~/pages/rex-deep-link/ui/RexDeepLinkBody';
import type { RecommendationOpenOptions } from '~/shared/types/recommendation';

function RexDeepLinkPage() {
  const router = useRouter();
  const deepLink = useRexDeepLink();

  const goToDiscover = useCallback(() => {
    router.replace(Routes.Main);
  }, [router]);

  const handleUserPress = useCallback(
    (userId: string) => {
      router.replace(toUserRoute(userId));
    },
    [router],
  );

  const handleRexPress = useCallback(
    (rexId: string, options?: RecommendationOpenOptions) => {
      router.push(toRexRoute(rexId, options));
    },
    [router],
  );

  return (
    <>
      <DeepLinkShell
        currentTab={TAB.discover}
        onTabChange={goToDiscover}
        onRexPress={handleRexPress}
      >
        <RexDeepLinkBody deepLink={deepLink} onGoToDiscover={goToDiscover} />
      </DeepLinkShell>
      {deepLink.recommendation ? (
        <RecommendationDetailModal
          visible
          recommendation={deepLink.recommendation}
          onClose={goToDiscover}
          onAuthorPress={handleUserPress}
          onUserPress={handleUserPress}
          scrollToComments={deepLink.scrollToComments}
          scrollToCommentId={deepLink.scrollToCommentId}
        />
      ) : null}
    </>
  );
}

export default function ProtectedRexDeepLinkPage() {
  return (
    <ProtectedRoute>
      <RexDeepLinkPage />
    </ProtectedRoute>
  );
}
