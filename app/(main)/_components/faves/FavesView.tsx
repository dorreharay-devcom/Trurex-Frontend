import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { Plus, List, Grid3x3, Bookmark } from 'lucide-react-native';
import { Theme } from '~/theme/Theme';
import { Button } from '~/components/common/Button';
import RecommendationCard, { Recommendation } from '../recommendation/RecommendationCard';
import { webContainerStyle } from '~/utils';
import { collections as SHARED_COLLECTIONS, recommendations } from '~/data/mockData';
import CollectionCard from '../profile/CollectionCard';

type ViewMode = 'list' | 'grid';

interface Collection {
  id: string;
  name: string;
  emoji: string;
  count: number;
  coverImage: string;
}

const MOCK_COLLECTIONS: Collection[] = [
  {
    id: '1',
    name: 'Date Night',
    emoji: '🕯️',
    count: 8,
    coverImage:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '2',
    name: 'Coffee Spots',
    emoji: '☕',
    count: 5,
    coverImage:
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '3',
    name: 'LA Eats',
    emoji: '🍽️',
    count: 12,
    coverImage:
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80',
  },
];

const SAVED_RECS: Recommendation[] = [
  {
    id: '3',
    title: 'Chateau Marmont',
    description: 'Timeless Hollywood glamour. Worth every penny for the history alone.',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
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
  {
    id: '4',
    title: 'Gjusta Bakery',
    description: 'The best sourdough in LA, hands down. Go early before they sell out.',
    image:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    categoryId: 'cafes-coffee',
    category: 'Cafes',
    location: 'Venice, CA',
    rating: 4.8,
    tags: ['bakery', 'sourdough', 'venice'],
    user: { name: 'Sam Park', handle: '@sampark', avatar: 'https://i.pravatar.cc/150?img=33' },
    timeAgo: '3d',
    likes: 95,
    comments: 14,
    saves: 44,
    isLiked: true,
    isSaved: true,
  },
  {
    id: '5',
    title: 'Griffith Observatory',
    description: 'The most stunning view of LA. Free entry, go at sunset for the magic hour.',
    image:
      'https://images.unsplash.com/photo-1530982011887-3cc11cc85693?auto=format&fit=crop&w=800&q=80',
    categoryId: 'experiences',
    category: 'Experiences',
    location: 'Los Angeles, CA',
    rating: 4.9,
    tags: ['views', 'sunset', 'free'],
    user: { name: 'Leo Kim', handle: '@leokim', avatar: 'https://i.pravatar.cc/150?img=15' },
    timeAgo: '5d',
    likes: 203,
    comments: 31,
    saves: 98,
    isLiked: false,
    isSaved: true,
  },
];

const CollectionCard: React.FC<{ collection: Collection }> = ({ collection }) => (
  <TouchableOpacity activeOpacity={0.85} className="w-44 h-56 rounded-xl overflow-hidden mr-3">
    <Image source={{ uri: collection.coverImage }} className="w-full h-full" resizeMode="cover" />
    <View className="absolute inset-0 bg-black/40" />
    <View className="absolute bottom-0 left-0 right-0 p-3">
      <Text className="text-2xl">{collection.emoji}</Text>
      <Text className="text-sm font-semibold text-white mt-1" numberOfLines={1}>
        {collection.name}
      </Text>
      <Text className="text-xs text-white/70">{collection.count} rexes</Text>
    </View>
  </TouchableOpacity>
);

const GridCard: React.FC<{ rec: Recommendation }> = ({ rec }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    className="w-[48.2%] sm:w-[31.7%] lg:w-[23.8%] rounded-xl overflow-hidden bg-card border border-border shadow-card"
  >
    <Image source={{ uri: rec.image }} className="w-full aspect-square" resizeMode="cover" />
    <View className="p-2.5">
      <Text className="text-xs font-semibold text-foreground" numberOfLines={1}>
        {rec.title}
      </Text>
      <Text className="text-[11px] text-muted-foreground mt-0.5" numberOfLines={1}>
        {rec.location}
      </Text>
    </View>
  </TouchableOpacity>
);

const EmptyState: React.FC = () => (
  <View className="items-center py-16">
    <Text className="text-4xl mb-3">💾</Text>
    <Text className="text-sm text-muted-foreground">Save recommendations to see them here</Text>
  </View>
);

interface FavesHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const FavesHeader: React.FC<FavesHeaderProps> = ({ viewMode, onViewModeChange }) => (
  <View>
    <View className="flex-row items-center justify-between px-4 pt-6 mb-6">
      <Text className="text-lg font-display font-bold text-foreground">My Faves</Text>
      <Button
        title="New Collection"
        icon={<Plus size={14} color={Theme.colors.primaryForeground} />}
        className="px-4 py-2"
        textClassName="text-xs font-semibold"
        onPress={() => {}}
      />
    </View>

    <View className="mb-6">
      <Text className="text-sm font-display font-semibold text-foreground px-4 mb-3">Collections</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-4 gap-3 pb-2"
      >
        {(SHARED_COLLECTIONS as any[]).map((col) => (
          <CollectionCard key={col.id} collection={col} />
        ))}
        <TouchableOpacity
          activeOpacity={0.7}
          className="w-44 h-56 rounded-xl border-2 border-dashed border-border items-center justify-center gap-2"
        >
          <Plus size={24} color={Theme.colors.muted} />
          <Text className="text-xs text-muted-foreground font-medium">Add Collection</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>

    <View className="flex-row items-center justify-between px-4 mb-3">
      <Text className="text-sm font-semibold text-foreground">Saved ({SAVED_RECS.length})</Text>
      <View className="flex-row gap-1">
        <TouchableOpacity
          onPress={() => onViewModeChange('list')}
          className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-muted' : ''}`}
        >
          <List
            size={16}
            color={viewMode === 'list' ? Theme.colors.foreground : Theme.colors.muted}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onViewModeChange('grid')}
          className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-muted' : ''}`}
        >
          <Grid2x2
            size={16}
            color={viewMode === 'grid' ? Theme.colors.foreground : Theme.colors.muted}
          />
        </TouchableOpacity>
      </View>
    </View>

    {viewMode === 'grid' && (
      <View className="px-4 pb-24">
        {SAVED_RECS.length === 0 ? (
          <EmptyState />
        ) : (
          <View className="flex-row flex-wrap gap-3">
            {SAVED_RECS.map((rec) => (
              <GridCard key={rec.id} rec={rec} />
            ))}
          </View>
        )}
      </View>
    )}
  </View>
);

const FavesView: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  return (
    <FlatList
      data={viewMode === 'list' ? SAVED_RECS : []}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={webContainerStyle}
      contentContainerClassName="pb-24"
      ListHeaderComponent={<FavesHeader viewMode={viewMode} onViewModeChange={setViewMode} />}
      renderItem={({ item }) => (
        <View className="px-4">
          <RecommendationCard recommendation={item} />
        </View>
      )}
      ListEmptyComponent={() => (viewMode === 'list' ? <EmptyState /> : null)}
    />
  );
};

export default FavesView;
