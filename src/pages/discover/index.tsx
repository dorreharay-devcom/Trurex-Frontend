import React, { useCallback, useState } from 'react';
import { View, FlatList } from 'react-native';
import AddToCollectionSheet from '~/components/faves/AddToCollectionSheet';
import { webContainerStyle } from '~/utils';
import RecommendationCard from '~/pages/discover/ui/feed/RecommendationCard';
import type { Recommendation, RecommendationOpenOptions } from '~/shared/types/recommendation';
import { useCategories } from '~/pages/discover/hooks/useCategories';
import { useFeed } from '~/pages/discover/hooks/useFeed';
import { useSaveToCollection } from '~/pages/discover/hooks/useSaveToCollection';
import { useScrollTop } from '~/pages/discover/hooks/useScrollTop';
import { useSearch } from '~/pages/discover/hooks/useSearch';
import { useSearchFilters } from '~/pages/discover/hooks/useSearchFilters';
import { webCardStyle } from '~/pages/discover/lib/layout';
import { ALL_CATEGORIES } from '~/pages/discover/types';
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
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const categories = useCategories();
  const filters = useSearchFilters();
  const search = useSearch({ searchQuery, activeCategory, filters });
  const feed = useFeed({ activeCategory, activeTag, enabled: !search.hasSearch });
  const save = useSaveToCollection();
  const scroll = useScrollTop<Recommendation>();

  const rows = search.hasSearch ? search.rows : feed.rows;
  const isLoading = search.hasSearch ? search.isLoading : feed.isLoading;

  const toggleCategory = useCallback((code: string) => {
    setActiveCategory((prev) => (prev === code ? ALL_CATEGORIES : code));
  }, []);

  const toggleTag = useCallback((slug: string) => {
    setActiveTag((prev) => (prev === slug ? null : slug));
  }, []);

  return (
    <View className="flex-1">
      <FlatList
        ref={scroll.listRef}
        data={isLoading ? [] : rows}
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
        ListEmptyComponent={isLoading ? null : <EmptyState onCreateRex={onCreateRex} />}
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

      {scroll.showScrollTop && <ScrollTopButton onPress={scroll.scrollToTop} />}

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
