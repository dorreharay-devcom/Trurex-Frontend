import React from 'react';
import DeepLinkShell from '~/widgets/DeepLinkShell';
import ProtectedRoute from '~/features/auth/ui/ProtectedRoute';
import RexDetailHost from '~/features/rex-detail/ui/RexDetailHost';
import { useRexPage } from '~/pages/rex/hooks/useRexPage';
import { useRexPageNav } from '~/pages/rex/hooks/useRexPageNav';
import RexPageBody from '~/pages/rex/ui/RexPageBody';
import { TAB } from '~/shared/config/mainTabs';

function RexPage() {
  const nav = useRexPageNav();
  const page = useRexPage();

  return (
    <>
      <DeepLinkShell
        currentTab={TAB.discover}
        onTabChange={nav.goToDiscover}
        onRexPress={nav.openRex}
      >
        <RexPageBody page={page} onGoToDiscover={nav.goToDiscover} />
      </DeepLinkShell>
      <RexDetailHost
        visible={page.recommendation != null}
        recommendation={page.recommendation}
        onClose={nav.goToDiscover}
        onAuthorPress={nav.openUser}
        onUserPress={nav.openUser}
        scrollToComments={page.scrollToComments}
        scrollToCommentId={page.scrollToCommentId}
      />
    </>
  );
}

export default function ProtectedRexPage() {
  return (
    <ProtectedRoute>
      <RexPage />
    </ProtectedRoute>
  );
}
