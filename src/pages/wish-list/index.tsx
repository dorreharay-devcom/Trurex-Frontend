import React, { useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ProtectedRoute from '~/features/auth/ui/ProtectedRoute';
import { useAuth } from '~/features/auth/providers';
import UserWishListScreen from '~/features/wish-list/ui/full-list/UserWishListScreen';
import DeepLinkShell from '~/widgets/DeepLinkShell';
import { TAB } from '~/shared/config/mainTabs';
import { Routes } from '~/shared/config/routes';
import { openMainTab } from '~/shared/lib/mainTab';
import { openCreateRex, openRex } from '~/shared/lib/navigation/createRex';
import { openWishListWizard } from '~/shared/lib/navigation/wishList';

function WishListPage() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const isOwnProfile = user?.id === userId;

  const onBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(Routes.Profile);
  }, [router]);

  return (
    <DeepLinkShell
      currentTab={TAB.profile}
      onTabChange={(tab) => openMainTab(router, tab)}
      onRexPress={(rexId, options) => openRex(router, rexId, options)}
    >
      <UserWishListScreen
        userId={userId}
        isOwnProfile={isOwnProfile}
        onBack={onBack}
        onOpenWishListWizard={(prefill) => openWishListWizard(router, prefill)}
        onNavigateToCreateRex={(source) => openCreateRex(router, { prefill: source })}
      />
    </DeepLinkShell>
  );
}

export default function ProtectedWishListPage() {
  return (
    <ProtectedRoute>
      <WishListPage />
    </ProtectedRoute>
  );
}
