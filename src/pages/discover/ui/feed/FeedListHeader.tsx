import React from 'react';
import { View, Text } from 'react-native';
import type { CategoriesState } from '~/pages/discover/hooks/useCategories';
import type { SearchFiltersState } from '~/pages/discover/hooks/useSearchFilters';
import { ALL_CATEGORIES } from '~/pages/discover/types';
import { webCardStyle } from '~/pages/discover/lib/layout';
import AllCategoriesSection from '~/pages/discover/ui/categories/AllCategoriesSection';
import PinnedCategoriesRow from '~/pages/discover/ui/categories/PinnedCategoriesRow';
import FilterBar from '~/pages/discover/ui/search/FilterBar';
import RecommendationCardSkeleton from './RecommendationCardSkeleton';
import TrendingTags from './TrendingTags';

const LOADING_SKELETON_COUNT = 2;

type Props = {
  hasSearch: boolean;
  searchQuery: string;
  filters: SearchFiltersState;
  categories: CategoriesState;
  activeCategory: string;
  activeTag: string | null;
  isLoading: boolean;
  onToggleCategory: (code: string) => void;
  onToggleTag: (slug: string) => void;
};

type TitleProps = Pick<
  Props,
  'hasSearch' | 'searchQuery' | 'filters' | 'categories' | 'activeCategory'
>;

function listTitle({
  hasSearch,
  searchQuery,
  filters,
  categories,
  activeCategory,
}: TitleProps): string {
  if (hasSearch) {
    return `Results for "${searchQuery}"${filters.hasActiveSearchFilters ? ' (filtered)' : ''}`;
  }
  if (activeCategory !== ALL_CATEGORIES) {
    const activeCat = categories.allCats.find((c) => c.code === activeCategory);
    return `${activeCat?.emoji ?? ''} ${activeCat?.label ?? ''} Recs`;
  }
  return 'Latest Rex';
}

type BrowseSectionsProps = Pick<
  Props,
  'categories' | 'activeCategory' | 'activeTag' | 'onToggleCategory' | 'onToggleTag'
>;

function BrowseSections({
  categories,
  activeCategory,
  activeTag,
  onToggleCategory,
  onToggleTag,
}: BrowseSectionsProps) {
  const hasPinned = categories.pinnedCats.length > 0;
  return (
    <>
      <TrendingTags activeTag={activeTag} onToggleTag={onToggleTag} />
      {hasPinned ? (
        <PinnedCategoriesRow
          cats={categories.pinnedCats}
          activeCategory={activeCategory}
          onSelectCategory={onToggleCategory}
          onUnpin={(serverId) => categories.togglePin(serverId, true)}
        />
      ) : null}
      <AllCategoriesSection
        allCats={categories.allCats}
        remainingCats={categories.remainingCats}
        hasPinned={hasPinned}
        activeCategory={activeCategory}
        categoriesPending={categories.categoriesPending}
        isPinned={categories.isPinned}
        isTogglingPin={categories.isTogglingPin}
        onSelectCategory={onToggleCategory}
        onTogglePin={categories.togglePin}
      />
    </>
  );
}

function FeedListHeader(props: Props) {
  const { hasSearch, filters, categories, isLoading } = props;
  return (
    <View className="px-4 pt-6 pb-2">
      {hasSearch ? (
        <FilterBar filters={filters} allCats={categories.allCats} />
      ) : (
        <BrowseSections {...props} />
      )}

      <Text className="text-sm font-display font-semibold text-foreground mb-4">
        {listTitle(props)}
      </Text>

      {isLoading ? (
        <View style={webCardStyle}>
          {Array.from({ length: LOADING_SKELETON_COUNT }, (_, i) => (
            <RecommendationCardSkeleton key={i} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

export default FeedListHeader;
