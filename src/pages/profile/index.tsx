import React, { useCallback } from 'react';
import ProtectedRoute from '~/features/auth/ui/ProtectedRoute';
import ProfileView from '~/features/profile/ui/ProfileView';
import { useProfilePage } from '~/pages/profile/hooks/useProfilePage';
import DeepLinkShell from '~/widgets/DeepLinkShell';
import { TAB } from '~/shared/config/mainTabs';
import { Routes } from '~/shared/config/routes';
import { COLLECTION_FROM, openCollection } from '~/shared/lib/navigation/openCollection';
import { openRexRequest } from '~/shared/lib/navigation/rexRequest';

function ProfilePage() {
  const page = useProfilePage();

  const onEditProfile = useCallback(() => {
    page.router.push(Routes.ProfileEdit);
  }, [page.router]);

  return (
    <DeepLinkShell currentTab={TAB.profile} onTabChange={page.goToTab} onRexPress={page.openRex}>
      <ProfileView
        userId={page.userId}
        handle={page.handle}
        onBack={page.goBack}
        onRexPress={page.openRecommendation}
        onEditProfile={onEditProfile}
        onOpenCollection={(collectionId) =>
          openCollection(page.router, collectionId, COLLECTION_FROM.share)
        }
        onOpenRexRequest={(requestId) => openRexRequest(page.router, requestId)}
      />
    </DeepLinkShell>
  );
}

export default function ProtectedProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}
