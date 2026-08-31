import React from 'react';
import { View } from 'react-native';
import DeepLinkShell from '~/widgets/DeepLinkShell';
import ProtectedRoute from '~/features/auth/ui/ProtectedRoute';
import RexRequestDetailHost from '~/features/rex-requests/ui/detail/RexRequestDetailHost';
import { useRexRequestPage } from '~/pages/rex-request/hooks/useRexRequestPage';
import { useRexRequestPageNav } from '~/pages/rex-request/hooks/useRexRequestPageNav';
import RexRequestPageBody from '~/pages/rex-request/ui/RexRequestPageBody';
import { TAB } from '~/shared/config/mainTabs';

function RexRequestPage() {
  const nav = useRexRequestPageNav();
  const page = useRexRequestPage();

  return (
    <View className="flex-1">
      <DeepLinkShell currentTab={TAB.discover} onTabChange={nav.changeTab} onRexPress={nav.openRex}>
        <RexRequestPageBody page={page} onGoToDiscover={nav.goToDiscover} />
      </DeepLinkShell>
      <RexRequestDetailHost
        embedded
        visible={page.request != null}
        request={page.request}
        onClose={nav.closeRexRequest}
        onUserPress={nav.openUser}
        onEditRequest={nav.openEditRexRequest}
        onOpenRex={nav.openRex}
      />
    </View>
  );
}

export default function ProtectedRexRequestPage() {
  return (
    <ProtectedRoute>
      <RexRequestPage />
    </ProtectedRoute>
  );
}
