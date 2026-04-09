import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { Plus, List, Grid3x3 } from 'lucide-react-native';
import { Theme } from '~/theme/Theme';
import { Button } from '~/components/common/Button';
import RecommendationCard from '~/components/recommendation/RecommendationCard';
import type { Recommendation, Collection } from '~/types/recommendation/recommendation';
import { webContainerStyle } from '~/utils';
import { collections as SHARED_COLLECTIONS, recommendations } from '~/data/mockData';
import CollectionCard from '~/components/profile/CollectionCard';

type ViewMode = 'list' | 'grid';

const SAVED_RECS: Recommendation[] = (recommendations as Recommendation[]).filter((r) => r.isSaved);

const GridCard: React.FC<{
  rec: Recommendation;
  onPress?: (rec: Recommendation) => void;
}> = ({ rec, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={() => onPress?.(rec)}
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
  onRecommendationPress?: (rec: Recommendation) => void;
}

const FavesHeader: React.FC<FavesHeaderProps> = ({
  viewMode,
  onViewModeChange,
  onRecommendationPress,
}) => (
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
      <Text className="text-sm font-display font-semibold text-foreground px-4 mb-3">
        Collections
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-4 gap-3 pb-2"
      >
        {(SHARED_COLLECTIONS as Collection[]).map((col) => (
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

    <View className="flex-row items-center justify-between px-4 mb-4">
      <Text className="text-sm font-display font-semibold text-foreground">
        Saved ({SAVED_RECS.length})
      </Text>
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
          <Grid3x3
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
              <GridCard key={rec.id} rec={rec} onPress={onRecommendationPress} />
            ))}
          </View>
        )}
      </View>
    )}
  </View>
);

type FavesViewProps = {
  onRecommendationPress?: (rec: Recommendation) => void;
};

const FavesView: React.FC<FavesViewProps> = ({ onRecommendationPress }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  return (
    <FlatList
      data={viewMode === 'list' ? SAVED_RECS : []}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={webContainerStyle}
      contentContainerClassName="pb-24"
      ListHeaderComponent={
        <FavesHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onRecommendationPress={onRecommendationPress}
        />
      }
      renderItem={({ item }) => (
        <View className="px-4">
          <RecommendationCard recommendation={item} onTap={onRecommendationPress} />
        </View>
      )}
      ListEmptyComponent={() => (viewMode === 'list' ? <EmptyState /> : null)}
    />
  );
};

export default FavesView;
