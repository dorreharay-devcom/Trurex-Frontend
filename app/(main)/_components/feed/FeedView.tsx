import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { webContainerStyle } from '~/utils';
import CategoryPills, { Category } from '../CategoryPills';
import RecommendationCard, { Recommendation } from '../recommendation/RecommendationCard';

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

const MOCK_RECS: Recommendation[] = [
  {
    id: '1',
    title: 'Nobu Malibu',
    description: 'Incredible omakase experience with ocean views. The black cod miso is life-changing.',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    categoryId: 'restaurants',
    category: 'Restaurants',
    location: 'Malibu, CA',
    rating: 4.9,
    tags: ['sushi', 'omakase', 'oceanview'],
    user: { name: 'Sarah Chen', handle: '@sarahchen', avatar: 'https://i.pravatar.cc/150?img=47' },
    timeAgo: '2h',
    likes: 84,
    comments: 12,
    saves: 31,
    isLiked: false,
    isSaved: false,
  },
  {
    id: '2',
    title: 'Alfred Coffee Melrose',
    description: 'Best matcha latte in LA. The aesthetic is unmatched and the vibes are immaculate.',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    categoryId: 'cafes-coffee',
    category: 'Cafes',
    location: 'Los Angeles, CA',
    rating: 4.7,
    tags: ['coffee', 'matcha', 'aesthetic'],
    user: { name: 'James Rivera', handle: '@jrivera', avatar: 'https://i.pravatar.cc/150?img=12' },
    timeAgo: '5h',
    likes: 56,
    comments: 8,
    saves: 22,
    isLiked: true,
    isSaved: false,
  },
  {
    id: '3',
    title: 'Chateau Marmont',
    description: 'Timeless Hollywood glamour. Worth every penny for the history alone.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    categoryId: 'hotels-accommodation',
    category: 'Hotels',
    location: 'West Hollywood, CA',
    rating: 4.5,
    tags: ['luxury', 'iconic', 'hollywood'],
    user: { name: 'Mia Torres', handle: '@mia.t', avatar: 'https://i.pravatar.cc/150?img=23' },
    timeAgo: '1d',
    likes: 120,
    comments: 19,
    saves: 67,
    isLiked: false,
    isSaved: true,
  },
];

const FeedView = ({ onTapRec }: { onTapRec?: (rec: Recommendation) => void }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all'
    ? MOCK_RECS
    : MOCK_RECS.filter((r) => r.category.toLowerCase() === activeCategory);

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
            <RecommendationCard recommendation={item} onTap={onTapRec} />
          </View>
        )}
      />
    </View>
  );
};

export default FeedView;
