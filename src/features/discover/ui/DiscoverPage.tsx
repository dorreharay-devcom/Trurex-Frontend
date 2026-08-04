import React, { memo, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import AddToCollectionSheet from '~/features/collections/ui/AddToCollectionSheet';
import { webContainerStyle } from '~/shared/lib/ui/styles';
import RecommendationCard from '~/features/discover/ui/feed/RecommendationCard';
import type { Recommendation, RecommendationOpenOptions } from '~/shared/types/recommendation';
import { useCategories } from '~/features/discover/hooks/useCategories';
import { useCategoryTagFilter } from '~/features/discover/hooks/useCategoryTagFilter';
import { useFeed } from '~/features/discover/hooks/useFeed';
import { useSaveToCollection } from '~/features/discover/hooks/useSaveToCollection';
import { useScrollTop } from '~/features/discover/hooks/useScrollTop';
import { useSearch } from '~/features/discover/hooks/useSearch';
import { useSearchFilters } from '~/features/discover/hooks/useSearchFilters';
import { webCardStyle } from '~/features/discover/lib/layout';
import EmptyState from '~/features/discover/ui/feed/EmptyState';
import FeedFooterSpinner from '~/features/discover/ui/feed/FeedFooterSpinner';
import FeedListHeader from '~/features/discover/ui/feed/FeedListHeader';
import ScrollTopButton from '~/features/discover/ui/feed/ScrollTopButton';

type DiscoverPageProps = {
  searchQuery?: string;
  onRecommendationPress?: (rec: Recommendation, options?: RecommendationOpenOptions) => void;
  onCreateRex?: () => void;
};

type FeedRowProps = {
  item: Recommendation;
  onTap?: (rec: Recommendation, options?: RecommendationOpenOptions) => void;
  onSave: (rec: Recommendation) => void;
};

const FeedRow = memo(function FeedRow({ item, onTap, onSave }: FeedRowProps) {
  return (
    <View className="px-4 mb-4" style={webCardStyle}>
      <RecommendationCard recommendation={item} onTap={onTap} onSave={onSave} />
    </View>
  );
});

const keyExtractor = (item: Recommendation) => item.id;

const DiscoverPage = ({
  searchQuery = '',
  onRecommendationPress,
  onCreateRex,
}: DiscoverPageProps) => {
  const { activeCategory, activeTag, toggleCategory, toggleTag } = useCategoryTagFilter();

  const categories = useCategories();
  const filters = useSearchFilters();
  const search = useSearch({ searchQuery, activeCategory, filters });
  const feed = useFeed({ activeCategory, activeTag, enabled: !search.hasSearch });
  const save = useSaveToCollection();
  const scroll = useScrollTop<Recommendation>();

  const source = search.hasSearch ? search : feed;
  const isLoading = source.isLoading;
  const rows = isLoading ? [] : source.rows;

  const onSave = save.openForRec;
  const onTap = onRecommendationPress;

  const renderItem = useCallback<ListRenderItem<Recommendation>>(
    ({ item }) => <FeedRow item={item} onTap={onTap} onSave={onSave} />,
    [onTap, onSave],
  );

  const listHeader = useMemo(
    () => (
      <FeedListHeader
        hasSearch={search.hasSearch}
        searchQuery={searchQuery}
        filters={filters}
        categories={categories}
        activeCategory={activeCategory}
        activeTag={activeTag}
        isLoading={isLoading}
        onToggleCategory={toggleCategory}
        onToggleTag={toggleTag}
      />
    ),
    [
      search.hasSearch,
      searchQuery,
      filters,
      categories,
      activeCategory,
      activeTag,
      isLoading,
      toggleCategory,
      toggleTag,
    ],
  );

  const listEmpty = useMemo(
    () => <EmptyState loading={isLoading} onCreateRex={onCreateRex} />,
    [isLoading, onCreateRex],
  );

  const listFooter = useMemo(
    () => <FeedFooterSpinner visible={!search.hasSearch && feed.isFetchingNextPage} />,
    [search.hasSearch, feed.isFetchingNextPage],
  );

  const contentContainerStyle = useMemo(() => [webContainerStyle, { paddingBottom: 96 }], []);

  return (
    <View className="flex-1">
      <FlashList
        ref={scroll.listRef}
        data={rows}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        onScroll={scroll.onScroll}
        onEndReached={feed.loadMore}
        onEndReachedThreshold={0.6}
        scrollEventThrottle={16}
        contentContainerStyle={contentContainerStyle}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
        ListFooterComponent={listFooter}
        drawDistance={500}
      />

      <ScrollTopButton visible={scroll.showScrollTop} onPress={scroll.scrollToTop} />

      <AddToCollectionSheet
        open={!!save.saveTarget}
        onClose={save.close}
        rec={save.saveTarget}
        onCollectionCreated={save.notifyCollectionCreated}
      />
    </View>
  );
};

export default DiscoverPage;
