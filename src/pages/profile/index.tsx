import React from 'react';
import ProtectedRoute from '~/features/auth/ui/ProtectedRoute';
import ProfileView from '~/features/profile/ui/ProfileView';
import RexDetailHost from '~/features/rex-detail/ui/RexDetailHost';
import { useProfilePage } from '~/pages/profile/hooks/useProfilePage';
import DeepLinkShell from '~/widgets/DeepLinkShell';
import { TAB } from '~/shared/config/mainTabs';

function ProfilePage() {
  const page = useProfilePage();

  return (
    <>
      <DeepLinkShell
        currentTab={TAB.profile}
        onTabChange={page.goToTab}
        onRexPress={page.preview.openById}
      >
        <ProfileView
          userId={page.userId}
          handle={page.handle}
          onBack={page.goBack}
          onRexPress={page.preview.open}
        />
      </DeepLinkShell>
      <RexDetailHost
        visible={page.preview.visible}
        recommendation={page.preview.recommendation}
        onClose={page.preview.close}
        onDismiss={page.preview.clear}
        scrollToComments={page.preview.options.scrollToComments}
        scrollToCommentId={page.preview.options.scrollToCommentId}
        onAuthorPress={page.openUser}
        onUserPress={page.openUser}
      />
    </>
  );
}

export default function ProtectedProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}
