import React from 'react';
import ProtectedRoute from '~/features/auth/ui/ProtectedRoute';
import ProfileView from '~/features/profile/ui/ProfileView';
import { useProfilePage } from '~/pages/profile/hooks/useProfilePage';
import DeepLinkShell from '~/widgets/DeepLinkShell';
import { TAB } from '~/shared/config/mainTabs';
import { COLLECTION_FROM, openCollection } from '~/shared/lib/navigation/openCollection';

function ProfilePage() {
  const page = useProfilePage();

  return (
    <DeepLinkShell currentTab={TAB.profile} onTabChange={page.goToTab} onRexPress={page.openRex}>
      <ProfileView
        userId={page.userId}
        handle={page.handle}
        onBack={page.goBack}
        onRexPress={page.openRecommendation}
        onOpenCollection={(collectionId) =>
          openCollection(page.router, collectionId, COLLECTION_FROM.share)
        }
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
