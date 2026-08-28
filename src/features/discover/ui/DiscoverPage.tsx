import React, { memo, useCallback, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
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
import { DEFAULT_SEARCH_DEBOUNCE_MS, useDebouncedValue } from '~/shared/hooks/useDebouncedValue';
import { webCardStyle } from '~/shared/lib/ui/styles';
import { DISCOVER_TAB, type DiscoverTab } from '~/features/discover/config/tabs';
import DiscoverTopChrome from '~/features/discover/ui/DiscoverTopChrome';
import TabSearchRow from '~/features/discover/ui/search/TabSearchRow';
import AudienceFilterControl from '~/features/discover/ui/filters/AudienceFilterControl';
import { AUDIENCE_FILTER_OPTIONS_NO_PRIVATE } from '~/features/discover/config/audienceFilters';
import RexRequestEmptyState from '~/features/discover/ui/rex-request/RexRequestEmptyState';
import DiscoverCollectionsTab from '~/features/discover/ui/collections/DiscoverCollectionsTab';
import EmptyState from '~/features/discover/ui/feed/EmptyState';
import FeedFooterSpinner from '~/features/discover/ui/feed/FeedFooterSpinner';
import FeedListHeader from '~/features/discover/ui/feed/FeedListHeader';
import ScrollTopButton from '~/features/discover/ui/feed/ScrollTopButton';
import QueryErrorState from '~/shared/ui/query/QueryErrorState';

type DiscoverPageProps = {
  onRecommendationPress?: (rec: Recommendation, options?: RecommendationOpenOptions) => void;
  onUserPress?: (userId: string) => void;
  onCreateRex?: () => void;
  onOpenCollection?: (collectionId: string) => void;
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
  onRecommendationPress,
  onUserPress,
  onCreateRex,
  onOpenCollection,
}: DiscoverPageProps) => {
  const [activeTab, setActiveTab] = useState<DiscoverTab>(DISCOVER_TAB.latestRex);
  const [latestRexSearch, setLatestRexSearch] = useState('');
  const [rexRequestSearch, setRexRequestSearch] = useState('');
  const debouncedLatestRexSearch = useDebouncedValue(latestRexSearch, DEFAULT_SEARCH_DEBOUNCE_MS);

  const { activeCategory, activeTag, toggleCategory, toggleTag } = useCategoryTagFilter();

  const categories = useCategories();
  const filters = useSearchFilters();
  const search = useSearch({ searchQuery: debouncedLatestRexSearch, activeCategory, filters });
  const feed = useFeed({ activeCategory, activeTag, enabled: !search.hasSearch });
  const save = useSaveToCollection();

  const source = search.hasSearch ? search : feed;
  const isLoading = source.isLoading;
  const isError = source.isError;
  const rows = useMemo(
    () => (isLoading && source.rows.length === 0 ? [] : source.rows),
    [isLoading, source.rows],
  );

  const includePeopleSuggestions =
    !search.hasSearch && rows.length >= PEOPLE_SUGGESTIONS_AFTER_REX_COUNT;

  const feedItems = useMemo(
    () => buildDiscoverFeedItems(rows, { includePeopleSuggestions }),
    [rows, includePeopleSuggestions],
  );

  const scroll = useScrollTop<DiscoverFeedItem>();

  const onSave = save.openForRec;
  const onTap = onRecommendationPress;

  const renderItem = useCallback<ListRenderItem<DiscoverFeedItem>>(
    ({ item }) => {
      if (item.type === 'people_suggestions') {
        return <PeopleYouMayKnowSection enabled embedInFeed onUserPress={onUserPress} />;
      }
      return <FeedRow item={item.recommendation} onTap={onTap} onSave={onSave} />;
    },
    [onTap, onSave, onUserPress],
  );

  const listHeader = useMemo(
    () => (
      <>
        <DiscoverTopChrome
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          showBrowse={!search.hasSearch}
          categories={categories}
          activeCategory={activeCategory}
          activeTag={activeTag}
          onToggleCategory={toggleCategory}
          onToggleTag={toggleTag}
        />
        <View className="px-4 pt-4">
          <TabSearchRow
            value={latestRexSearch}
            onChangeText={setLatestRexSearch}
            placeholder="Search rex..."
            filterSlot={<AudienceFilterControl />}
          />
        </View>
        <FeedListHeader
          hasSearch={search.hasSearch}
          filters={filters}
          categories={categories}
          isLoading={isLoading}
        />
      </>
    ),
    [
      activeTab,
      search.hasSearch,
      categories,
      activeCategory,
      activeTag,
      toggleCategory,
      toggleTag,
      latestRexSearch,
      filters,
      isLoading,
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
      {activeTab === DISCOVER_TAB.latestRex ? (
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
        </View>
      ) : null}

      {activeTab === DISCOVER_TAB.rexRequest ? (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[webContainerStyle, { paddingBottom: 96 }]}
        >
          <DiscoverTopChrome
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            showBrowse
            showTrending={false}
            categories={categories}
            activeCategory={activeCategory}
            activeTag={activeTag}
            onToggleCategory={toggleCategory}
            onToggleTag={toggleTag}
          />
          <View className="px-4 pt-6">
            <TabSearchRow
              value={rexRequestSearch}
              onChangeText={setRexRequestSearch}
              placeholder="Search rex requests"
              filterSlot={<AudienceFilterControl options={AUDIENCE_FILTER_OPTIONS_NO_PRIVATE} />}
            />
          </View>
          <RexRequestEmptyState />
        </ScrollView>
      ) : null}

      {activeTab === DISCOVER_TAB.collections ? (
        <DiscoverCollectionsTab
          onOpenCollection={onOpenCollection}
          headerSlot={
            <DiscoverTopChrome
              activeTab={activeTab}
              onChangeTab={setActiveTab}
              showBrowse={false}
              categories={categories}
              activeCategory={activeCategory}
              activeTag={activeTag}
              onToggleCategory={toggleCategory}
              onToggleTag={toggleTag}
            />
          }
        />
      ) : null}

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
