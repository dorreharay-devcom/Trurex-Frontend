import React, { useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AddRexToCollectionSheet from '~/features/collections/ui/AddRexToCollectionSheet';
import CollectionDetailView from '~/features/collections/ui/CollectionDetailView';
import DeepLinkShell from '~/shared/ui/DeepLinkShell';
import ProtectedRoute from '~/components/common/ProtectedRoute';
import RecommendationDetailModal from '~/features/rex-detail/ui/RecommendationDetailModal';
import { TAB } from '~/components/layout/TabBar';
import { toMainTabRoute } from '~/shared/config/routes';
import { useRexPreview } from '~/features/rex-detail/hooks/useRexPreview';

function CollectionPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const preview = useRexPreview();
  const [addToCollectionId, setAddToCollectionId] = useState<string | null>(null);

  return (
    <>
      <DeepLinkShell
        currentTab={TAB.faves}
        onTabChange={(tab) => router.replace(toMainTabRoute(tab))}
        onRexPress={preview.openById}
      >
        <View className="flex-1">
          <CollectionDetailView
            collectionId={id}
            onBack={() => router.replace(toMainTabRoute(TAB.faves))}
            onAddItem={setAddToCollectionId}
            onRecommendationPress={preview.open}
          />
        </View>
      </DeepLinkShell>
      <AddRexToCollectionSheet
        open={addToCollectionId != null}
        collectionId={addToCollectionId}
        onClose={() => setAddToCollectionId(null)}
      />
      <RecommendationDetailModal
        visible={preview.visible}
        recommendation={preview.recommendation}
        onClose={preview.close}
        onDismiss={preview.clear}
        onCommentCountChange={() => {}}
        scrollToComments={preview.options.scrollToComments}
        scrollToCommentId={preview.options.scrollToCommentId}
      />
    </>
  );
}

export default function ProtectedCollectionPage() {
  return (
    <ProtectedRoute>
      <CollectionPage />
    </ProtectedRoute>
  );
}
