import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { webContainerStyle } from '~/utils';
import CategoryPills, { Category } from '~/components/layout/CategoryPills';
import RecommendationCard, { Recommendation } from '~/components/recommendation/RecommendationCard';
import { useDiscoverRecommendations } from '~/hooks/useDiscovery';
import { MOCK_RECS } from '~/constants/recommendation/mockRecommendations';

const CATEGORIES: Category[] = [
  { id: 'all', label: 'All', emoji: '🔥', color: '#9333ea' },
  { id: 'restaurants', label: 'Restaurants', emoji: '🍽️', color: '#f04a1e' },
  { id: 'cafes-coffee', label: 'Cafes', emoji: '☕', color: '#df7a11' },
  { id: 'hotels-accommodation', label: 'Hotels', emoji: '🏨', color: '#2e86de' },
  { id: 'experiences-tours', label: 'Experiences', emoji: '✨', color: '#df3b7e' },
  { id: 'growth-learning', label: 'Books', emoji: '📚', color: '#2aa66b' },
  { id: 'bars-nightlife', label: 'Bars', emoji: '🍸', color: '#7a57d4' },
  { id: 'real-estate', label: 'Real Estate', emoji: '🏠', color: '#0d9488' },
];

type DiscoverViewProps = {
  searchQuery?: string;
  onRecommendationPress?: (rec: Recommendation) => void;
  onTapRec?: (rec: Recommendation) => void;
};

const DiscoverView = ({ searchQuery = '', onRecommendationPress, onTapRec }: DiscoverViewProps) => {
  const onOpenRec = onRecommendationPress ?? onTapRec;
  const [activeCategory, setActiveCategory] = useState('all');
  const { data, isLoading } = useDiscoverRecommendations();

  const recs = data?.length ? data : MOCK_RECS;

  const filtered = useMemo(() => {
    const byCategory =
      activeCategory === 'all' ? recs : recs.filter((r) => r.categoryId === activeCategory);
    const q = searchQuery.trim().toLowerCase();
    if (!q) return byCategory;
    return byCategory.filter((r) => {
      const tags = r.tags ?? [];
      return (
        r.title.toLowerCase().includes(q) ||
        (r.description?.toLowerCase() ?? '').includes(q) ||
        (r.location?.toLowerCase() ?? '').includes(q) ||
        r.category.toLowerCase().includes(q) ||
        tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [recs, activeCategory, searchQuery]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="text-sm text-muted mt-3">Loading discover…</Text>
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

export default DiscoverView;
