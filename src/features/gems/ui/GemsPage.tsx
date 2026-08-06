import React, { useState } from 'react';
import { View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { LoadMoreButton } from '~/shared/ui/primitives/LoadMoreButton';
import QueryListFooter from '~/shared/ui/query/QueryListFooter';
import { useGemsData } from '~/features/gems/hooks/useGemsData';
import { useGemsPageState } from '~/features/gems/hooks/useGemsPageState';
import { useRemoveUncollected } from '~/features/gems/hooks/useRemoveUncollected';
import GemsHeader from '~/features/gems/ui/GemsHeader';
import GemsOverlays from '~/features/gems/ui/GemsOverlays';
import UncollectedEmpty from '~/features/gems/ui/UncollectedEmpty';
import UncollectedRexRow from '~/features/gems/ui/uncollected-rex-row/UncollectedRexRow';
import type { Recommendation, RecommendationOpenOptions } from '~/shared/types/recommendation';
import { webContainerStyle } from '~/shared/lib/ui/styles';

type GemsPageProps = {
  onRecommendationPress?: (rec: Recommendation, options?: RecommendationOpenOptions) => void;
  onOpenCollection?: (collectionId: string) => void;
};

function GemsPage({ onRecommendationPress, onOpenCollection }: GemsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { collections, uncollected } = useGemsData(searchQuery);
  const page = useGemsPageState({ onOpenCollection });
  const removeUncollected = useRemoveUncollected();

  return (
    <>
      <FlashList
        data={uncollected.items}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[webContainerStyle, { paddingBottom: 96 }]}
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
          <UncollectedEmpty
            loading={uncollected.loading}
            isError={uncollected.isError}
            hasSearch={Boolean(searchQuery.trim())}
            onRetry={uncollected.retry}
          />
        }
        ListFooterComponent={
          <View className="px-4">
            {uncollected.isFetchNextPageError ? (
              <QueryListFooter isError onRetry={uncollected.fetchNextPage} />
            ) : (
              <LoadMoreButton
                visible={!uncollected.loading && uncollected.hasNextPage}
                loading={uncollected.isFetchingNextPage}
                onPress={uncollected.fetchNextPage}
              />
            )}
          </View>
        }
        drawDistance={400}
      />

      <GemsOverlays page={page} removeUncollected={removeUncollected} />
    </>
  );
}

export default GemsPage;
