import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Modal, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { Plus, List, Grid3x3 } from 'lucide-react-native';
import { SignedStorageImage } from '~/components/common/SignedStorageImage';
import { Theme } from '~/theme/Theme';
import { Button } from '~/components/common/Button';
import RecommendationCard from '~/components/recommendation/RecommendationCard';
import CollectionCard from '~/components/profile/CollectionCard';
import CollectionDetailView from '~/components/faves/CollectionDetailView';
import CreateCollectionModal from '~/components/faves/CreateCollectionModal';
import { REX_IMAGES_BUCKET } from '~/constants/storageBuckets';
import type { Recommendation, RecommendationOpenOptions } from '~/types/recommendation/recommendation';
import { webContainerStyle } from '~/utils';
import {
  rexCoverRemoteHttpUrl,
  rexCoverStoragePathFromRecommendation,
} from '~/utils/recommendation/rexMediaPaths';
import { useMyCollections, useAddRexToCollection } from '~/hooks/useCollections';
import { useSavedRexes } from '~/hooks/useGems';

type ViewMode = 'list' | 'grid';

const GridCard: React.FC<{
  rec: Recommendation;
  onPress?: (rec: Recommendation) => void;
}> = ({ rec, onPress }) => {
  const coverPath = rexCoverStoragePathFromRecommendation(rec);
  const coverHttp = rexCoverRemoteHttpUrl(rec);
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress?.(rec)}
      className="w-[48.2%] rounded-xl overflow-hidden bg-card border border-border shadow-card"
    >
      <SignedStorageImage
        bucket={REX_IMAGES_BUCKET}
        storagePath={coverPath}
        remoteUri={coverHttp}
        className="aspect-square w-full"
        accessibilityLabel={rec.title}
      />
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
};

const EmptyState: React.FC = () => (
  <View className="items-center py-16">
    <Text className="text-4xl mb-3">💾</Text>
    <Text className="text-sm text-muted-foreground">Save recommendations to see them here</Text>
  </View>
);

interface FavesHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  savedRexes: Recommendation[];
  onRecommendationPress?: (rec: Recommendation, options?: RecommendationOpenOptions) => void;
  onOpenCollection: (id: string) => void;
  onNewCollection: () => void;
}

const FavesHeader: React.FC<FavesHeaderProps> = ({
  viewMode,
  onViewModeChange,
  savedRexes,
  onRecommendationPress,
  onOpenCollection,
  onNewCollection,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = Math.floor((screenWidth - 32 - 24) / 3);
  const cardHeight = Math.round(cardWidth * (4 / 3));

  const { data: collections = [], isLoading: loadingCollections } = useMyCollections();

  return (
    <View>
      <View className="flex-row items-center justify-between px-4 pt-6 mb-4">
        <Text className="text-lg font-display font-bold text-foreground">My Faves</Text>
        <Button
          title="New Collection"
          icon={<Plus size={14} color={Theme.colors.primaryForeground} />}
          className="px-4 py-2"
          textClassName="text-xs font-semibold"
          onPress={onNewCollection}
        />
      </View>

      <View className="mb-6 px-4">
        <Text className="text-sm font-display font-semibold text-foreground mb-3">
          Collections
        </Text>

        {loadingCollections ? (
          <View className="flex-row flex-wrap gap-3">
            {[1, 2, 3].map((i) => (
              <View
                key={i}
                style={{ width: cardWidth, height: cardHeight, borderRadius: 12 }}
                className="bg-muted"
              />
            ))}
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-3">
            {collections.map((col) => (
              <CollectionCard
                key={col.id}
                collection={col}
                width={cardWidth}
                onPress={() => onOpenCollection(col.id)}
              />
            ))}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onNewCollection}
              style={{ width: cardWidth, height: cardHeight, borderRadius: 12 }}
              className="border-2 border-dashed border-border items-center justify-center gap-2"
            >
              <Plus size={24} color={Theme.colors.muted} />
              <Text className="text-xs text-muted-foreground font-medium">New</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View className="flex-row items-center justify-between px-4 mb-4">
        <Text className="text-sm font-display font-semibold text-foreground">
          Saved ({savedRexes.length})
        </Text>
        <View className="flex-row gap-1">
          <TouchableOpacity
            onPress={() => onViewModeChange('list')}
            className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-muted' : ''}`}
          >
            <List size={16} color={viewMode === 'list' ? Theme.colors.foreground : Theme.colors.muted} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onViewModeChange('grid')}
            className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-muted' : ''}`}
          >
            <Grid3x3 size={16} color={viewMode === 'grid' ? Theme.colors.foreground : Theme.colors.muted} />
          </TouchableOpacity>
        </View>
      </View>

      {viewMode === 'grid' && (
        <View className="px-4 pb-24">
          {savedRexes.length === 0 ? (
            <EmptyState />
          ) : (
            <View className="flex-row flex-wrap gap-3">
              {savedRexes.map((rec) => (
                <GridCard key={rec.id} rec={rec} onPress={onRecommendationPress} />
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

type FavesViewProps = {
  commentCountByRexId?: Record<string, number>;
  onRecommendationPress?: (rec: Recommendation, options?: RecommendationOpenOptions) => void;
};

const FavesView: React.FC<FavesViewProps> = ({ commentCountByRexId, onRecommendationPress }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [openCollectionId, setOpenCollectionId] = useState<string | null>(null);
  const [addToCollectionId, setAddToCollectionId] = useState<string | null>(null);
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const { data: savedRexes = [] } = useSavedRexes();
  const { mutate: addRex } = useAddRexToCollection();

  if (openCollectionId) {
    return (
      <>
        <CollectionDetailView
          collectionId={openCollectionId}
          onBack={() => setOpenCollectionId(null)}
          onAddItem={(id) => setAddToCollectionId(id)}
        />
        <Modal
          visible={!!addToCollectionId}
          transparent
          animationType="slide"
          onRequestClose={() => setAddToCollectionId(null)}
        >
          <Pressable
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}
            onPress={() => setAddToCollectionId(null)}
          >
            <Pressable onPress={() => {}}>
              <View className="bg-card rounded-t-2xl border-t border-border" style={{ maxHeight: 400 }}>
                <View className="items-center py-3">
                  <View className="w-10 h-1 rounded-full bg-muted-foreground/30" />
                </View>
                <View className="px-4 pb-3">
                  <Text className="text-base font-display font-medium text-foreground">Pick a saved rex</Text>
                </View>
                <View className="h-px bg-border mx-4 mb-1" />
                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                  {savedRexes.length === 0 ? (
                    <Text className="text-sm text-muted-foreground text-center py-6">No saved rexes</Text>
                  ) : (
                    <View className="px-4 py-2 gap-1">
                      {savedRexes.map((rec) => (
                        <TouchableOpacity
                          key={rec.id}
                          activeOpacity={0.7}
                          onPress={() => {
                            if (!addToCollectionId) return;
                            addRex(
                              { collection_id: addToCollectionId, rex_id: rec.id },
                              { onSuccess: () => setAddToCollectionId(null) },
                            );
                          }}
                          className="flex-row items-center gap-3 p-3 rounded-xl"
                        >
                          <View className="w-10 h-10 rounded-lg bg-muted" />
                          <View className="flex-1">
                            <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>{rec.title}</Text>
                            <Text className="text-xs text-muted-foreground">{rec.category}</Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                  <View className="h-4" />
                </ScrollView>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </>
    );
  }

  return (
    <>
      <FlatList
        data={viewMode === 'list' ? savedRexes : []}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={webContainerStyle}
        contentContainerClassName="pb-24"
        ListHeaderComponent={
          <FavesHeader
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            savedRexes={savedRexes}
            onRecommendationPress={onRecommendationPress}
            onOpenCollection={setOpenCollectionId}
            onNewCollection={() => setShowCreateCollection(true)}
          />
        }
        renderItem={({ item }) => {
          const n = commentCountByRexId?.[item.id];
          const rec = n !== undefined ? { ...item, comments: n } : item;
          return (
            <View className="px-4">
              <RecommendationCard recommendation={rec} onTap={onRecommendationPress} />
            </View>
          );
        }}
        ListEmptyComponent={() => (viewMode === 'list' ? <EmptyState /> : null)}
      />

      <CreateCollectionModal
        open={showCreateCollection}
        onClose={() => setShowCreateCollection(false)}
        onCreated={(id) => {
          setShowCreateCollection(false);
          setOpenCollectionId(id);
        }}
      />
    </>
  );
};

export default FavesView;
