import React from 'react';
import { useRouter } from 'expo-router';
import ProtectedRoute from '~/features/auth/ui/ProtectedRoute';
import DeepLinkShell from '~/widgets/DeepLinkShell';
import ReferralsScreen from '~/features/referrals/ui/ReferralsScreen';
import { TAB } from '~/shared/config/mainTabs';
import { openMainTab } from '~/shared/lib/mainTab';
import { openRex } from '~/shared/lib/navigation/createRex';
import { Routes, toUserRoute } from '~/shared/config/routes';

function ReferralsPage() {
  const router = useRouter();

  return (
    <DeepLinkShell
      currentTab={TAB.profile}
      onTabChange={(tab) => openMainTab(router, tab)}
      onRexPress={(rexId, options) => openRex(router, rexId, options)}
    >
      <ReferralsScreen
        onBack={() => (router.canGoBack() ? router.back() : router.replace(Routes.Profile))}
        onUserPress={(userId) => router.push(toUserRoute(userId))}
      />
    </DeepLinkShell>
  );
}

export default function ProtectedReferralsPage() {
  return (
    <ProtectedRoute>
      <ReferralsPage />
    </ProtectedRoute>
  );
}
