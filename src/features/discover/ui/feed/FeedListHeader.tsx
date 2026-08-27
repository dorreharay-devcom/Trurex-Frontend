import React from 'react';
import { View } from 'react-native';
import type { CategoriesState } from '~/features/discover/hooks/useCategories';
import type { SearchFiltersState } from '~/features/discover/hooks/useSearchFilters';
import { webCardStyle } from '~/shared/lib/ui/styles';
import FilterBar from '~/features/discover/ui/search/FilterBar';
import RecommendationCardSkeleton from './RecommendationCardSkeleton';

const LOADING_SKELETON_COUNT = 2;

type Props = {
  hasSearch: boolean;
  filters: SearchFiltersState;
  categories: CategoriesState;
  isLoading: boolean;
};

function FeedListHeader({ hasSearch, filters, categories, isLoading }: Props) {
  if (!hasSearch && !isLoading) return null;

  return (
    <View className="px-4 pt-6 pb-2">
      {hasSearch ? <FilterBar filters={filters} allCats={categories.allCats} /> : null}

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
