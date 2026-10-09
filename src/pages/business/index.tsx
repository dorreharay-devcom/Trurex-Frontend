import React, { useEffect } from 'react';
import { View } from 'react-native';
import DeepLinkShell from '~/widgets/DeepLinkShell';
import ProtectedRoute from '~/features/auth/ui/ProtectedRoute';
import { useBusinessPage } from '~/pages/business/hooks/useBusinessPage';
import { useBusinessPageNav } from '~/pages/business/hooks/useBusinessPageNav';
import BusinessPageBody from '~/pages/business/ui/BusinessPageBody';
import { TAB } from '~/shared/config/mainTabs';

function BusinessPage() {
  const nav = useBusinessPageNav();
  const page = useBusinessPage();

  const becameInvisible =
    !page.summary.isPending && page.summary.data?.is_visible_business_page === false;

  useEffect(() => {
    if (becameInvisible) nav.goToDiscover();
  }, [becameInvisible, nav]);

  return (
    <View className="flex-1">
      <DeepLinkShell currentTab={TAB.discover} onTabChange={nav.changeTab} onRexPress={nav.openRex}>
        <BusinessPageBody page={page} onBack={nav.goBack} onOpenRex={nav.openRex} />
      </DeepLinkShell>
    </View>
  );
}

export default function ProtectedBusinessPage() {
  return (
    <ProtectedRoute>
      <BusinessPage />
    </ProtectedRoute>
  );
}
