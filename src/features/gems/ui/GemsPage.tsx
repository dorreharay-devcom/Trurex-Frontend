import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import { LoadMoreButton } from '~/shared/ui/LoadMoreButton';
import { useGemsData } from '~/features/gems/hooks/useGemsData';
import { useGemsPageState } from '~/features/gems/hooks/useGemsPageState';
import { useRemoveUncollected } from '~/features/gems/hooks/useRemoveUncollected';
import CollectionDetailScreen from '~/features/gems/ui/CollectionDetailScreen';
import GemsHeader from '~/features/gems/ui/GemsHeader';
import GemsOverlays from '~/features/gems/ui/GemsOverlays';
import UncollectedEmpty from '~/features/gems/ui/UncollectedEmpty';
import UncollectedRexRow from '~/features/gems/ui/uncollected-rex-row/UncollectedRexRow';
import type { Recommendation, RecommendationOpenOptions } from '~/shared/types/recommendation';
import { webContainerStyle } from '~/shared/lib/ui/styles';

type GemsPageProps = {
  onRecommendationPress?: (rec: Recommendation, options?: RecommendationOpenOptions) => void;
};

function GemsPage({ onRecommendationPress }: GemsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { collections, uncollected } = useGemsData(searchQuery);
  const page = useGemsPageState();
  const removeUncollected = useRemoveUncollected();

  if (page.openCollectionId) {
    return (
      <CollectionDetailScreen
        collectionId={page.openCollectionId}
        onBack={page.closeCollection}
        onRecommendationPress={onRecommendationPress}
      />
    );
  }

  return (
    <>
      <FlatList
        data={uncollected.items}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={webContainerStyle}
        contentContainerClassName="pb-24"
        ListHeaderComponent={
          <GemsHeader
            searchQuery={searchQuery}
            onChangeSearch={setSearchQuery}
            collections={collections}
            loadingUncollected={uncollected.loading}
            onOpenCollection={page.openCollection}
            onCreateCollection={page.openCreateCollection}
          />
        }
        renderItem={({ item }) => (
          <UncollectedRexRow
            item={item}
            onPress={onRecommendationPress ? () => onRecommendationPress(item) : undefined}
            onAdd={() => page.openAddToCollection(item)}
            onRemove={() => removeUncollected.setTarget(item)}
          />
        )}
        ListEmptyComponent={
          <UncollectedEmpty loading={uncollected.loading} hasSearch={Boolean(searchQuery.trim())} />
        }
        ListFooterComponent={
          <View className="px-4">
            <LoadMoreButton
              visible={!uncollected.loading && uncollected.hasNextPage}
              loading={uncollected.isFetchingNextPage}
              onPress={uncollected.fetchNextPage}
            />
          </View>
        }
      />

      <GemsOverlays page={page} removeUncollected={removeUncollected} />
    </>
  );
}

export default GemsPage;
