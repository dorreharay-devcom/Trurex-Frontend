import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PlusCircle } from 'lucide-react-native';
import { Theme } from '~/theme/Theme';
import { Header } from './_components/Header';
import { TabBar, Tab } from './_components/TabBar';
import FeedView from './_components/feed/FeedView';
import FavesView from './_components/faves/FavesView';
import ProfileView from './_components/profile/ProfileView';
import { CreateModal } from './_components/recommendation/create/CreateModal';

const PlaceholderView = ({ title }: { title: string }) => (
  <View className="flex-1 items-center justify-center">
    <Text className="text-2xl font-bold text-foreground">{title}</Text>
    <Text className="text-sm text-muted mt-2">Coming soon</Text>
  </View>
);

export default function HomeScreen() {
  const [currentTab, setCurrentTab] = useState<Tab>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [createRecommendationOpen, setCreateRecommendationOpen] = useState(false);

  return (
    <View className="flex-1 bg-background">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onProfilePress={() => setCurrentTab('profile')}
        isProfileActive={currentTab === 'profile'}
        onAddPress={() => setCreateRecommendationOpen(true)}
      />

      <TabBar currentTab={currentTab} onTabChange={setCurrentTab} />

      <View className="flex-1">
        {currentTab === 'feed' && <FeedView />}
        {currentTab === 'discover' && <PlaceholderView title="Discover" />}
        {currentTab === 'faves' && <FavesView />}
        {currentTab === 'network' && <PlaceholderView title="Network" />}
        {currentTab === 'map' && <PlaceholderView title="Map" />}
        {currentTab === 'profile' && <ProfileView />}
      </View>

      {currentTab === 'feed' && (
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

      <CreateModal
        visible={createRecommendationOpen}
        onClose={() => setCreateRecommendationOpen(false)}
      />
    </View>
  );
}
