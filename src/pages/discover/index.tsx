import React from 'react';
import { View, FlatList } from 'react-native';
import AddToCollectionSheet from '~/features/collections/ui/AddToCollectionSheet';
import { webContainerStyle } from '~/utils';
import RecommendationCard from '~/pages/discover/ui/feed/RecommendationCard';
import type { Recommendation, RecommendationOpenOptions } from '~/shared/types/recommendation';
import { useCategories } from '~/pages/discover/hooks/useCategories';
import { useCategoryTagFilter } from '~/pages/discover/hooks/useCategoryTagFilter';
import { useFeed } from '~/pages/discover/hooks/useFeed';
import { useSaveToCollection } from '~/pages/discover/hooks/useSaveToCollection';
import { useScrollTop } from '~/pages/discover/hooks/useScrollTop';
import { useSearch } from '~/pages/discover/hooks/useSearch';
import { useSearchFilters } from '~/pages/discover/hooks/useSearchFilters';
import { webCardStyle } from '~/pages/discover/lib/layout';
import EmptyState from '~/pages/discover/ui/feed/EmptyState';
import FeedFooterSpinner from '~/pages/discover/ui/feed/FeedFooterSpinner';
import FeedListHeader from '~/pages/discover/ui/feed/FeedListHeader';
import ScrollTopButton from '~/pages/discover/ui/feed/ScrollTopButton';

type DiscoverPageProps = {
  searchQuery?: string;
  onRecommendationPress?: (rec: Recommendation, options?: RecommendationOpenOptions) => void;
  onCreateRex?: () => void;
};

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

  return (
    <View className="flex-1">
      <FlatList
        ref={scroll.listRef}
        data={rows}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        onScroll={scroll.onScroll}
        onEndReached={feed.loadMore}
        onEndReachedThreshold={0.6}
        scrollEventThrottle={16}
        contentContainerStyle={webContainerStyle}
        contentContainerClassName="pb-24"
        ListHeaderComponent={
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
        }
        ListEmptyComponent={<EmptyState loading={isLoading} onCreateRex={onCreateRex} />}
        renderItem={({ item }) => (
          <View className="px-4 mb-4" style={webCardStyle}>
            <RecommendationCard
              recommendation={item}
              onTap={onRecommendationPress}
              onSave={save.openForRec}
            />
          </View>
        )}
        ListFooterComponent={
          <FeedFooterSpinner visible={!search.hasSearch && feed.isFetchingNextPage} />
        }
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
