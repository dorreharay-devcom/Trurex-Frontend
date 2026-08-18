import React, { memo, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import AddToCollectionSheet from '~/features/collections/ui/AddToCollectionSheet';
import PeopleYouMayKnowSection from '~/features/circles/ui/people/PeopleYouMayKnowSection';
import { webContainerStyle } from '~/shared/lib/ui/styles';
import RecommendationCard from '~/features/discover/ui/feed/RecommendationCard';
import type { Recommendation, RecommendationOpenOptions } from '~/shared/types/recommendation';
import {
  buildDiscoverFeedItems,
  PEOPLE_SUGGESTIONS_AFTER_REX_COUNT,
  type DiscoverFeedItem,
} from '~/features/discover/lib/buildDiscoverFeedItems';
import { useCategories } from '~/features/discover/hooks/useCategories';
import { useCategoryTagFilter } from '~/features/discover/hooks/useCategoryTagFilter';
import { useFeed } from '~/features/discover/hooks/useFeed';
import { useSaveToCollection } from '~/features/discover/hooks/useSaveToCollection';
import { useScrollTop } from '~/features/discover/hooks/useScrollTop';
import { useSearch } from '~/features/discover/hooks/useSearch';
import { useSearchFilters } from '~/features/discover/hooks/useSearchFilters';
import { webCardStyle } from '~/shared/lib/ui/styles';
import EmptyState from '~/features/discover/ui/feed/EmptyState';
import FeedFooterSpinner from '~/features/discover/ui/feed/FeedFooterSpinner';
import FeedListHeader from '~/features/discover/ui/feed/FeedListHeader';
import ScrollTopButton from '~/features/discover/ui/feed/ScrollTopButton';
import QueryErrorState from '~/shared/ui/query/QueryErrorState';

type DiscoverPageProps = {
  searchQuery?: string;
  onRecommendationPress?: (rec: Recommendation, options?: RecommendationOpenOptions) => void;
  onUserPress?: (userId: string) => void;
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

const keyExtractor = (item: DiscoverFeedItem) => item.id;
const getItemType = (item: DiscoverFeedItem) => item.type;

const DiscoverPage = ({
  searchQuery = '',
  onRecommendationPress,
  onUserPress,
  onCreateRex,
}: DiscoverPageProps) => {
  const { activeCategory, activeTag, toggleCategory, toggleTag } = useCategoryTagFilter();

  const categories = useCategories();
  const filters = useSearchFilters();
  const search = useSearch({ searchQuery, activeCategory, filters });
  const feed = useFeed({ activeCategory, activeTag, enabled: !search.hasSearch });
  const save = useSaveToCollection();

  const scrollPersistenceKey = useMemo(
    () => `discover:${searchQuery}:${activeCategory}:${activeTag ?? ''}`,
    [searchQuery, activeCategory, activeTag],
  );

  const source = search.hasSearch ? search : feed;
  const isLoading = source.isLoading;
  const isError = source.isError;
  const rows = isLoading && source.rows.length === 0 ? [] : source.rows;

  const includePeopleSuggestions =
    !search.hasSearch && rows.length >= PEOPLE_SUGGESTIONS_AFTER_REX_COUNT;

  const feedItems = useMemo(
    () => buildDiscoverFeedItems(rows, { includePeopleSuggestions }),
    [rows, includePeopleSuggestions],
  );

  const scroll = useScrollTop<DiscoverFeedItem>({
    persistenceKey: scrollPersistenceKey,
    restoreWhen: feedItems.length > 0,
  });

  const onSave = save.openForRec;
  const onTap = onRecommendationPress;

  const renderItem = useCallback<ListRenderItem<DiscoverFeedItem>>(
    ({ item }) => {
      if (item.type === 'people_suggestions') {
        return (
          <PeopleYouMayKnowSection enabled embedInFeed onUserPress={onUserPress} />
        );
      }
      return <FeedRow item={item.recommendation} onTap={onTap} onSave={onSave} />;
    },
    [onTap, onSave, onUserPress],
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

  const listEmpty = useMemo(() => {
    if (isError) {
      return (
        <QueryErrorState
          title={search.hasSearch ? "Couldn't search" : "Couldn't load recommendations"}
          onRetry={source.refetch}
        />
      );
    }
    return <EmptyState loading={isLoading} onCreateRex={onCreateRex} />;
  }, [isError, isLoading, onCreateRex, search.hasSearch, source.refetch]);

  const listFooter = useMemo(() => {
    if (search.hasSearch) return null;
    if (feed.isFetchNextPageError) {
      return <QueryErrorState compact title="Couldn't load more" onRetry={feed.retryNextPage} />;
    }
    return <FeedFooterSpinner visible={feed.isFetchingNextPage} />;
  }, [search.hasSearch, feed.isFetchNextPageError, feed.retryNextPage, feed.isFetchingNextPage]);

  const contentContainerStyle = useMemo(() => [webContainerStyle, { paddingBottom: 96 }], []);

  return (
    <View className="flex-1">
      <FlashList
        ref={scroll.listRef}
        data={feedItems}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
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
