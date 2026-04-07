import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Header } from './_components/Header';
import { TabBar, Tab } from './_components/TabBar';
import CategoryPills, { Category } from './_components/CategoryPills';
import RecommendationCard from './_components/recommendation/RecommendationCard';
import { CreateModal } from './_components/recommendation/create/CreateModal';
import { REX_CATEGORIES } from '~/constants/recommendation/rexCategories';
import { MOCK_RECS } from '~/constants/recommendation/mockRecommendations';

const CATEGORIES: Category[] = [
  { id: 'all', label: 'All', emoji: '🔥', color: '#9333ea' },
  ...REX_CATEGORIES,
];

const PlaceholderView = ({ title }: { title: string }) => (
  <View className="flex-1 items-center justify-center">
    <Text className="text-2xl font-bold text-foreground">{title}</Text>
    <Text className="text-sm text-muted mt-2">Coming soon</Text>
  </View>
);

import { isWeb } from '~/utils';

const containerStyle = isWeb
  ? { maxWidth: 1280, width: '100%' as const, alignSelf: 'center' as const }
  : undefined;

const FeedView = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered =
    activeCategory === 'all' ? MOCK_RECS : MOCK_RECS.filter((r) => r.categoryId === activeCategory);

  return (
    <View className="flex-1">
      <View style={containerStyle} className="px-4 pt-8 pb-3">
        <CategoryPills
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[containerStyle, { paddingHorizontal: 16, paddingBottom: 96 }]}
        ListEmptyComponent={() => (
          <View className="items-center py-16">
            <Text className="text-4xl mb-3">🦖</Text>
            <Text className="text-sm text-muted">No recs yet. Be the first to add one!</Text>
          </View>
        )}
        renderItem={({ item }) => <RecommendationCard recommendation={item} />}
      />
    </View>
  );
};

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
        onAddPress={() => setCreateRecommendationOpen(true)}
      />

      <TabBar currentTab={currentTab} onTabChange={setCurrentTab} />

      <View className="flex-1">
        {currentTab === 'feed' && <FeedView />}
        {currentTab === 'discover' && <PlaceholderView title="Discover" />}
        {currentTab === 'faves' && <PlaceholderView title="My Faves" />}
        {currentTab === 'network' && <PlaceholderView title="Network" />}
        {currentTab === 'map' && <PlaceholderView title="Map" />}
        {currentTab === 'profile' && <PlaceholderView title="Profile" />}
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
