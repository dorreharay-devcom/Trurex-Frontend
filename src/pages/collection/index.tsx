import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AddRexToCollectionSheet from '~/features/collections/ui/AddRexToCollectionSheet';
import CollectionDetailView from '~/features/collections/ui/CollectionDetailView';
import DeepLinkShell from '~/widgets/DeepLinkShell';
import ProtectedRoute from '~/features/auth/ui/ProtectedRoute';
import RexDetailHost from '~/features/rex-detail/ui/RexDetailHost';
import { TAB } from '~/shared/config/mainTabs';
import { openMainTab } from '~/shared/lib/mainTab';
import { useRexPreview } from '~/features/rex-detail/hooks/useRexPreview';
import { parseOptionalRouteId } from '~/shared/lib/navigation/routeIds';

function CollectionPage() {
  const params = useLocalSearchParams<{ id: string }>();
  const collectionId = parseOptionalRouteId(params.id);
  const router = useRouter();
  const preview = useRexPreview();
  const [addToCollectionId, setAddToCollectionId] = useState<string | null>(null);

  return (
    <>
      <DeepLinkShell
        currentTab={TAB.faves}
        onTabChange={(tab) => openMainTab(router, tab)}
        onRexPress={preview.openById}
      >
        <View className="flex-1">
          {collectionId ? (
            <CollectionDetailView
              collectionId={collectionId}
              onBack={() => openMainTab(router, TAB.faves)}
              onAddItem={setAddToCollectionId}
              onRecommendationPress={preview.open}
            />
          ) : (
            <View className="flex-1 items-center justify-center gap-2 px-8">
              <Text className="text-lg font-semibold text-foreground">Collection not found</Text>
              <Text className="text-center text-sm text-muted-foreground">
                This link is invalid or the collection may have been removed.
              </Text>
            </View>
          )}
        </View>
      </DeepLinkShell>
      <AddRexToCollectionSheet
        open={addToCollectionId != null}
        collectionId={addToCollectionId}
        onClose={() => setAddToCollectionId(null)}
      />
      <RexDetailHost
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
