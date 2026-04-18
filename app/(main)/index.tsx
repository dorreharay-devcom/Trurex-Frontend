import React, { useCallback, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { PlusCircle } from 'lucide-react-native';
import ProfileView from '~/components/profile/ProfileView';
import FavesView from '~/components/faves/FavesView';
import DiscoverView from '~/components/discover/DiscoverView';
import MapScreen from '~/components/map/MapScreen';
import CirclesView from '~/components/circles/CirclesView';
import { Header } from '~/components/layout/Header';
import { TabBar, Tab } from '~/components/layout/TabBar';
import { CreateModal } from '~/components/recommendation/create/CreateModal';
import { RecommendationDetailModal } from '~/components/recommendation/RecommendationDetailModal';
import { Theme } from '~/theme/Theme';
import type {
  Recommendation,
  RecommendationOpenOptions,
} from '~/types/recommendation/recommendation';

export default function HomeScreen() {
  const [currentTab, setCurrentTab] = useState<Tab>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [createRecommendationOpen, setCreateRecommendationOpen] = useState(false);
  const [previewRecommendation, setPreviewRecommendation] = useState<Recommendation | null>(null);
  const [previewOptions, setPreviewOptions] = useState<RecommendationOpenOptions>({});
  const [commentCountByRexId, setCommentCountByRexId] = useState<Record<string, number>>({});

  const handleCloseCreate = useCallback(() => {
    setCreateRecommendationOpen(false);
  }, []);

  const openCreateFromDetail = useCallback(() => {
    setCreateRecommendationOpen(true);
    setPreviewRecommendation(null);
    setPreviewOptions({});
  }, []);

  const openPreview = useCallback((rec: Recommendation, options?: RecommendationOpenOptions) => {
    setPreviewOptions(options ?? {});
    setPreviewRecommendation(rec);
  }, []);

  const closePreview = useCallback(() => {
    setPreviewRecommendation(null);
    setPreviewOptions({});
  }, []);

  const handleCommentCountChange = useCallback(
    (total: number) => {
      const id = previewRecommendation?.id;
      if (id) setCommentCountByRexId((prev) => ({ ...prev, [id]: total }));
    },
    [previewRecommendation?.id],
  );

  return (
    <View className="flex-1 bg-background">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onProfilePress={() => setCurrentTab('profile')}
        onAddPress={() => setCreateRecommendationOpen(true)}
      />

      <TabBar currentTab={currentTab} onTabChange={setCurrentTab} />

      <View className="flex-1">
        {currentTab === 'discover' && (
          <DiscoverView
            searchQuery={searchQuery}
            commentCountByRexId={commentCountByRexId}
            onRecommendationPress={openPreview}
          />
        )}
        {currentTab === 'faves' && (
          <FavesView
            commentCountByRexId={commentCountByRexId}
            onRecommendationPress={openPreview}
          />
        )}
        {currentTab === 'circles' && <CirclesView isActive={currentTab === 'circles'} />}
        {currentTab === 'map' && <MapScreen onRecommendationPress={openPreview} />}
        {currentTab === 'profile' && <ProfileView />}
      </View>

      {currentTab === 'discover' && (
        <TouchableOpacity
          onPress={() => setCreateRecommendationOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Add Rex"
          className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-primary items-center justify-center hover:opacity-90 active:opacity-75 cursor-pointer"
          style={{
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          }}
        >
          <PlusCircle size={28} color={Theme.colors.primaryForeground} />
        </TouchableOpacity>
      )}

      <CreateModal visible={createRecommendationOpen} onClose={handleCloseCreate} />

      <RecommendationDetailModal
        visible={previewRecommendation != null}
        recommendation={previewRecommendation}
        onClose={closePreview}
        onAddYourOwn={openCreateFromDetail}
        onCommentCountChange={handleCommentCountChange}
        scrollToComments={previewOptions.scrollToComments === true}
      />
    </View>
  );
}
