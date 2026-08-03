import React from 'react';
import DeepLinkShell from '~/shared/ui/DeepLinkShell';
import ProtectedRoute from '~/features/auth/ui/ProtectedRoute';
import RecommendationDetailModal from '~/features/rex-detail/ui/RecommendationDetailModal';
import { TAB } from '~/shared/ui/shell/TabBar';
import { useDeepLinkNav } from '~/pages/rex-deep-link/hooks/useDeepLinkNav';
import { useRexDeepLink } from '~/pages/rex-deep-link/hooks/useRexDeepLink';
import RexDeepLinkBody from '~/pages/rex-deep-link/ui/RexDeepLinkBody';

function RexDeepLinkPage() {
  const nav = useDeepLinkNav();
  const deepLink = useRexDeepLink();

  return (
    <>
      <DeepLinkShell
        currentTab={TAB.discover}
        onTabChange={nav.goToDiscover}
        onRexPress={nav.openRex}
      >
        <RexDeepLinkBody deepLink={deepLink} onGoToDiscover={nav.goToDiscover} />
      </DeepLinkShell>
      <RecommendationDetailModal
        visible={deepLink.recommendation != null}
        recommendation={deepLink.recommendation}
        onClose={nav.goToDiscover}
        onAuthorPress={nav.openUser}
        onUserPress={nav.openUser}
        scrollToComments={deepLink.scrollToComments}
        scrollToCommentId={deepLink.scrollToCommentId}
      />
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
