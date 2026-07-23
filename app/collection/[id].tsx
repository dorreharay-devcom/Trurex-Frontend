import React, { useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CollectionDetailView from '~/components/faves/CollectionDetailView';
import AddRexToCollectionSheet from '~/components/faves/AddRexToCollectionSheet';
import { RecommendationDetailModal } from '~/components/recommendation/RecommendationDetailModal';
import { Header } from '~/components/layout/Header';
import { TabBar } from '~/components/layout/TabBar';
import ProtectedRoute from '~/components/common/ProtectedRoute';
import type {
  Recommendation,
  RecommendationOpenOptions,
} from '~/types/recommendation/recommendation';
import { recommendationStubFromId } from '~/utils/recommendation/recommendationStubFromId';

export default function CollectionPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [addToCollectionId, setAddToCollectionId] = useState<string | null>(null);
  const [previewRecommendation, setPreviewRecommendation] = useState<Recommendation | null>(null);
  const [previewOptions, setPreviewOptions] = useState<RecommendationOpenOptions>({});

  const openPreview = (rec: Recommendation, options?: RecommendationOpenOptions) => {
    setPreviewOptions(options ?? {});
    setPreviewRecommendation(rec);
  };

  const openRexById = (rexId: string, options?: RecommendationOpenOptions) => {
    openPreview(recommendationStubFromId(rexId), options);
  };

  const closePreview = () => {
    setPreviewRecommendation(null);
    setPreviewOptions({});
  };

  return (
    <ProtectedRoute>
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <Header
          searchQuery=""
          onSearchChange={() => {}}
          onProfilePress={() => router.replace('/')}
          onAddPress={() => router.replace('/')}
          onUserPress={(userId) => router.replace(`/user/${userId}`)}
          onRexPress={openRexById}
          showSearch={false}
        />
        <TabBar currentTab="faves" onTabChange={(tab) => router.replace(`/?tab=${tab}`)} />
        <View className="flex-1">
          <CollectionDetailView
            collectionId={id}
            onBack={() => router.replace('/?tab=faves')}
            onAddItem={(collectionId) => setAddToCollectionId(collectionId)}
            onRecommendationPress={openPreview}
          />
        </View>
        <AddRexToCollectionSheet
          open={!!addToCollectionId}
          collectionId={addToCollectionId}
          onClose={() => setAddToCollectionId(null)}
        />
        <RecommendationDetailModal
          visible={previewRecommendation != null}
          recommendation={previewRecommendation}
          onClose={closePreview}
          onCommentCountChange={() => {}}
          scrollToComments={previewOptions.scrollToComments === true}
          scrollToCommentId={previewOptions.scrollToCommentId}
        />
      </SafeAreaView>
    </ProtectedRoute>
  );
}
