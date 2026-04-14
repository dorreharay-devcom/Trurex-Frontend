import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PlusCircle } from 'lucide-react-native';
import ProfileView from '~/components/profile/ProfileView';
import FavesView from '~/components/faves/FavesView';
import DiscoverView from '~/components/discover/DiscoverView';
import MapScreen from '~/components/map/MapScreen';
import { Header } from '~/components/layout/Header';
import { TabBar, Tab } from '~/components/layout/TabBar';
import { CreateModal } from '~/components/recommendation/create/CreateModal';
import { RecommendationDetailModal } from '~/components/recommendation/RecommendationDetailModal';
import { Theme } from '~/theme/Theme';
import type { Recommendation } from '~/types/recommendation/recommendation';

const PlaceholderView = ({ title }: { title: string }) => (
  <View className="flex-1 items-center justify-center">
    <Text className="text-2xl font-bold text-foreground">{title}</Text>
    <Text className="text-sm text-muted mt-2">Coming soon</Text>
  </View>
);

export default function HomeScreen() {
  const [currentTab, setCurrentTab] = useState<Tab>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [createRecommendationOpen, setCreateRecommendationOpen] = useState(false);
  const [previewRecommendation, setPreviewRecommendation] = useState<Recommendation | null>(null);

  const handleCloseCreate = useCallback(() => {
    setCreateRecommendationOpen(false);
  }, []);

  const openCreateFromDetail = useCallback(() => {
    setCreateRecommendationOpen(true);
    setPreviewRecommendation(null);
  }, []);

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
            onRecommendationPress={(rec) => setPreviewRecommendation(rec)}
          />
        )}
        {currentTab === 'faves' && (
          <FavesView onRecommendationPress={(rec) => setPreviewRecommendation(rec)} />
        )}
        {currentTab === 'network' && <PlaceholderView title="Network" />}
        {currentTab === 'map' && (
          <MapScreen onRecommendationPress={(rec) => setPreviewRecommendation(rec)} />
        )}
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
        onClose={() => setPreviewRecommendation(null)}
        onAddYourOwn={openCreateFromDetail}
      />
    </View>
  );
}
