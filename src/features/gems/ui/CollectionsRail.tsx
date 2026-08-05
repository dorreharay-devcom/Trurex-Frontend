import React from 'react';
import { ScrollView, View } from 'react-native';
import CollectionCard from '~/features/collections/ui/CollectionCard';
import { LoadMoreButton } from '~/shared/ui/LoadMoreButton';
import EmptyCollectionsCard from '~/features/gems/ui/EmptyCollectionsCard';
import type { GemsCollectionsState } from '~/features/gems/hooks/useGemsData';

const SKELETON_COUNT = 3;

function RailSkeleton() {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
      <View className="flex-row gap-3">
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <View
            key={i}
            style={{ width: 160, height: 204, borderRadius: 12 }}
            className="bg-border/40"
          />
        ))}
      </View>
    </ScrollView>
  );
}

type Props = {
  collections: GemsCollectionsState;
  onOpenCollection: (id: string) => void;
  onCreateCollection: () => void;
};

function CollectionsRail({ collections, onOpenCollection, onCreateCollection }: Props) {
  if (collections.loading) return <RailSkeleton />;
  if (collections.items.length === 0) return <EmptyCollectionsCard onCreate={onCreateCollection} />;

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 pb-1"
      >
        {collections.items.map((col) => (
          <CollectionCard key={col.id} collection={col} onPress={() => onOpenCollection(col.id)} />
        ))}
      </ScrollView>
      <View className="mb-6">
        <LoadMoreButton
          visible={collections.hasNextPage}
          loading={collections.isFetchingNextPage}
          onPress={collections.fetchNextPage}
        />
      </View>
    </>
  );
}

export default CollectionsRail;
