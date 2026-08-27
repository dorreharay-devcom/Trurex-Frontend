import React, { type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import CollectionCard from '~/features/collections/ui/CollectionCard';
import ProfileGridCell from '~/features/profile/ui/ProfileGridCell';
import { ProfileCollectionsSkeleton } from '~/features/profile/ui/skeleton';
import type { DiscoverCollectionRow } from '~/features/discover/api/types';
import { useDiscoverCollectionsGrid } from '~/features/discover/hooks/useDiscoverCollectionsGrid';
import { mapDiscoverCollectionToUserCollection } from '~/features/discover/lib/mapDiscoverCollection';
import CollectionsFeedEmptyState from '~/features/discover/ui/collections/CollectionsFeedEmptyState';
import TabSearchRow from '~/features/discover/ui/search/TabSearchRow';
import QueryErrorState from '~/shared/ui/query/QueryErrorState';
import QueryListFooter from '~/shared/ui/query/QueryListFooter';
import { webContainerStyle } from '~/shared/lib/ui/styles';

type Props = {
  onOpenCollection?: (collectionId: string) => void;
  headerSlot?: ReactNode;
};

function GridEmptyState({
  loading,
  isError,
  gridContentWidth,
  onRetry,
}: {
  loading: boolean;
  isError: boolean;
  gridContentWidth: number;
  onRetry: () => void;
}) {
  if (loading) return <ProfileCollectionsSkeleton windowWidth={gridContentWidth} />;
  if (isError) return <QueryErrorState title="Couldn't load collections" onRetry={onRetry} />;
  return <CollectionsFeedEmptyState />;
}

const DiscoverCollectionsTab = ({ onOpenCollection, headerSlot }: Props) => {
  const grid = useDiscoverCollectionsGrid();

  return (
    <ScrollView
      className="min-h-0 flex-1"
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      onScroll={grid.onScroll}
      contentContainerStyle={[webContainerStyle, { paddingBottom: 96 }]}
    >
      {headerSlot}

      <View style={{ paddingHorizontal: grid.gridPad }}>
        <View className="pt-4">
          <TabSearchRow
            value={grid.searchQuery}
            onChangeText={grid.setSearchQuery}
            placeholder="Search collections"
          />
        </View>

        <View className="mt-4 w-full" onLayout={grid.onGridLayout}>
          {grid.hasItems ? (
            <>
              <View
                className="w-full flex-row flex-wrap"
                style={{ marginHorizontal: -grid.halfGap }}
              >
                {grid.feed.rows.map((item: DiscoverCollectionRow) => (
                  <ProfileGridCell key={item.id} numColumns={grid.numColumns} gap={grid.gap}>
                    <CollectionCard
                      collection={mapDiscoverCollectionToUserCollection(item)}
                      fill
                      onPress={() => onOpenCollection?.(item.id)}
                    />
                  </ProfileGridCell>
                ))}
              </View>
              <QueryListFooter
                loading={grid.feed.isFetchingNextPage}
                isError={grid.feed.isFetchNextPageError}
                onRetry={grid.feed.retryNextPage}
              />
            </>
          ) : (
            <GridEmptyState
              loading={grid.feed.isLoading}
              isError={grid.feed.isError}
              gridContentWidth={grid.gridContentWidth}
              onRetry={grid.feed.refetch}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default DiscoverCollectionsTab;
