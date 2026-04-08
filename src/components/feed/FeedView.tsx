import React, { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { webContainerStyle } from '~/utils';
import CategoryPills, { Category } from '~/components/layout/CategoryPills';
import RecommendationCard, { Recommendation } from '~/components/recommendation/RecommendationCard';
import { useDiscoveryFeed } from '~/hooks/useDiscovery';
import { MOCK_RECS } from '~/constants/recommendation/mockRecommendations';

const CATEGORIES: Category[] = [
  { id: 'all', label: 'All', emoji: '🔥', color: '#9333ea' },
  { id: 'restaurants', label: 'Restaurants', emoji: '🍽️', color: '#f04a1e' },
  { id: 'cafes', label: 'Cafes', emoji: '☕', color: '#df7a11' },
  { id: 'hotels', label: 'Hotels', emoji: '🏨', color: '#2e86de' },
  { id: 'experiences', label: 'Experiences', emoji: '✨', color: '#df3b7e' },
  { id: 'books', label: 'Books', emoji: '📚', color: '#2aa66b' },
  { id: 'bars', label: 'Bars', emoji: '🍸', color: '#7a57d4' },
  { id: 'places', label: 'Places', emoji: '📍', color: '#e6a611' },
];

type FeedViewProps = {
  onRecommendationPress?: (rec: Recommendation) => void;
  onTapRec?: (rec: Recommendation) => void;
};

const FeedView = ({ onRecommendationPress, onTapRec }: FeedViewProps) => {
  const onOpenRec = onRecommendationPress ?? onTapRec;
  const [activeCategory, setActiveCategory] = useState('all');
  const { data, isLoading, error } = useDiscoveryFeed();

  const recs = data?.length ? data : MOCK_RECS;
  const filtered =
    activeCategory === 'all' ? recs : recs.filter((r) => r.category.toLowerCase() === activeCategory);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="text-sm text-muted mt-3">Loading feed...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-2xl mb-3">❌</Text>
        <Text className="text-sm font-semibold text-foreground mb-1">API Error</Text>
        <Text className="text-xs text-muted text-center">{String(error)}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={webContainerStyle}
        contentContainerClassName="pb-24"
        ListHeaderComponent={() => (
          <View style={webContainerStyle} className="px-4 pt-8 pb-3">
            <CategoryPills
              categories={CATEGORIES}
              activeCategory={activeCategory}
              onSelect={setActiveCategory}
            />
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="items-center py-16">
            <Text className="text-4xl mb-3">🦖</Text>
            <Text className="text-sm text-muted">No recs yet. Be the first to add one!</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View className="px-4">
            <RecommendationCard recommendation={item} onTap={onOpenRec} />
          </View>
        )}
      />
    </View>
  );
};

export default FeedView;
