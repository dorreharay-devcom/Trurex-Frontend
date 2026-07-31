import React, { useCallback, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ViewStyle,
} from 'react-native';
import AddToCollectionSheet, { RecSummary } from '~/components/faves/AddToCollectionSheet';
import { isWeb, webContainerStyle } from '~/utils';
import RecommendationCard, { Recommendation } from '~/components/recommendation/RecommendationCard';
import { RecommendationCardSkeleton } from '~/components/recommendation/RecommendationCardSkeleton';
import { Theme } from '~/shared/theme/Theme';
import type { RecommendationOpenOptions } from '~/types/recommendation/recommendation';
import { toastSuccess } from '~/utils/appToast';
import { modalConfig } from '~/constants/recommendation/modalConfig';
import { useCategories } from '~/pages/discover/hooks/useCategories';
import { useFeed, FEED_QUERY_KEY } from '~/pages/discover/hooks/useFeed';
import { useSearch } from '~/pages/discover/hooks/useSearch';
import { useSearchFilters } from '~/pages/discover/hooks/useSearchFilters';
import { ALL_CATEGORIES } from '~/pages/discover/types';
import FilterBar from '~/pages/discover/ui/search/FilterBar';
import TrendingTags from '~/pages/discover/ui/feed/TrendingTags';
import PinnedCategoriesRow from '~/pages/discover/ui/categories/PinnedCategoriesRow';
import AllCategoriesSection from '~/pages/discover/ui/categories/AllCategoriesSection';
import EmptyState from '~/pages/discover/ui/feed/EmptyState';
import ScrollTopButton from '~/pages/discover/ui/feed/ScrollTopButton';

const SAVE_SHEET_TOAST_DELAY_MS = modalConfig.timing.sheetCloseMs + 180;
const SCROLL_TOP_THRESHOLD = 600;

const webCardStyle: ViewStyle | undefined = isWeb
  ? { maxWidth: 680, width: '100%', alignSelf: 'center' }
  : undefined;

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
  const queryClient = useQueryClient();
  const listRef = useRef<FlatList<Recommendation>>(null);

  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [saveTarget, setSaveTarget] = useState<RecSummary | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const categories = useCategories();
  const filters = useSearchFilters();
  const search = useSearch({ searchQuery, activeCategory, filters });
  const feed = useFeed({ activeCategory, activeTag, enabled: !search.hasSearch });

  const rows = search.hasSearch ? search.rows : feed.rows;
  const isLoading = search.hasSearch ? search.isLoading : feed.isLoading;

  const toggleCategory = useCallback((code: string) => {
    setActiveCategory((prev) => (prev === code ? ALL_CATEGORIES : code));
  }, []);

  const toggleTag = useCallback((slug: string) => {
    setActiveTag((prev) => (prev === slug ? null : slug));
  }, []);

  const handleSavePress = useCallback((rec: Recommendation) => {
    setSaveTarget({
      id: rec.id,
      place_name: rec.title,
      category_code: rec.categoryId,
      location: rec.location,
      isSaved: rec.isSaved,
    });
  }, []);

  const handleSaveSheetClose = useCallback(() => {
    setSaveTarget(null);
    queryClient.invalidateQueries({ queryKey: [FEED_QUERY_KEY] });
  }, [queryClient]);

  const handleCollectionCreated = useCallback((collectionName: string) => {
    setTimeout(() => {
      toastSuccess('New collection added', `Added to ${collectionName}`);
    }, SAVE_SHEET_TOAST_DELAY_MS);
  }, []);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const shouldShow = event.nativeEvent.contentOffset.y > SCROLL_TOP_THRESHOLD;
    setShowScrollTop((visible) => (visible === shouldShow ? visible : shouldShow));
  }, []);

  const scrollToTop = useCallback(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  const activeCat = categories.allCats.find((c) => c.code === activeCategory);
  const listTitle = (() => {
    if (search.hasSearch) {
      return `Results for "${searchQuery}"${filters.hasActiveSearchFilters ? ' (filtered)' : ''}`;
    }
    if (activeCategory !== ALL_CATEGORIES) {
      return `${activeCat?.emoji ?? ''} ${activeCat?.label ?? ''} Recs`;
    }
    return 'Latest Rex';
  })();

  const ListHeader = (
    <View className="px-4 pt-6 pb-2">
      {search.hasSearch ? (
        <FilterBar filters={filters} allCats={categories.allCats} />
      ) : (
        <>
          <TrendingTags activeTag={activeTag} onToggleTag={toggleTag} />
          {categories.pinnedCats.length > 0 && (
            <PinnedCategoriesRow
              cats={categories.pinnedCats}
              activeCategory={activeCategory}
              onSelectCategory={toggleCategory}
              onUnpin={(serverId) => categories.togglePin(serverId, true)}
            />
          )}
          <AllCategoriesSection
            allCats={categories.allCats}
            remainingCats={categories.remainingCats}
            hasPinned={categories.pinnedCats.length > 0}
            activeCategory={activeCategory}
            categoriesPending={categories.categoriesPending}
            isPinned={categories.isPinned}
            isTogglingPin={categories.isTogglingPin}
            onSelectCategory={toggleCategory}
            onTogglePin={categories.togglePin}
          />
        </>
      )}

      <Text className="text-sm font-display font-semibold text-foreground mb-4">{listTitle}</Text>

      {isLoading && (
        <View style={webCardStyle}>
          {[1, 2].map((i) => (
            <RecommendationCardSkeleton key={i} />
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1">
      <FlatList
        ref={listRef}
        data={isLoading ? [] : rows}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        onEndReached={feed.loadMore}
        onEndReachedThreshold={0.6}
        scrollEventThrottle={16}
        contentContainerStyle={webContainerStyle}
        contentContainerClassName="pb-24"
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={isLoading ? null : <EmptyState onCreateRex={onCreateRex} />}
        renderItem={({ item }) => (
          <View className="px-4 mb-4" style={webCardStyle}>
            <RecommendationCard
              recommendation={item}
              onTap={onRecommendationPress}
              onSave={handleSavePress}
            />
          </View>
        )}
        ListFooterComponent={
          !search.hasSearch && feed.isFetchingNextPage ? (
            <View className="items-center py-6">
              <ActivityIndicator size="small" color={Theme.colors.primary} />
            </View>
          ) : null
        }
      />

      {showScrollTop && <ScrollTopButton onPress={scrollToTop} />}

      <AddToCollectionSheet
        open={!!saveTarget}
        onClose={handleSaveSheetClose}
        rec={saveTarget}
        onCollectionCreated={handleCollectionCreated}
      />
    </View>
  );
};

export default DiscoverPage;
