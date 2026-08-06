import React from 'react';
import { useRouter } from 'expo-router';
import CollectionDetailRoute from '~/features/collections/ui/CollectionDetailRoute';
import ProtectedRoute from '~/features/auth/ui/ProtectedRoute';
import DeepLinkShell from '~/widgets/DeepLinkShell';
import { TAB } from '~/shared/config/mainTabs';
import { openMainTab } from '~/shared/lib/mainTab';
import { openRex } from '~/shared/lib/navigation/createRex';
import { COLLECTION_FROM } from '~/shared/lib/navigation/openCollection';

function CollectionPage() {
  const router = useRouter();

  return (
    <DeepLinkShell
      currentTab={TAB.faves}
      onTabChange={(tab) => openMainTab(router, tab)}
      onRexPress={(rexId, options) => openRex(router, rexId, options)}
    >
      <CollectionDetailRoute from={COLLECTION_FROM.share} paramKey="id" />
    </DeepLinkShell>
  );
}

export default function ProtectedCollectionPage() {
  return (
    <ProtectedRoute>
      <CollectionPage />
    </ProtectedRoute>
  );
}
