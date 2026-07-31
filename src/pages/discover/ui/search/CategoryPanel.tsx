import React from 'react';
import { View } from 'react-native';
import type { SearchFiltersState } from '~/pages/discover/hooks/useSearchFilters';
import FilterOptionPill from '~/pages/discover/ui/search/FilterOptionPill';
import type { Category } from '~/pages/discover/types';

type CategoryPanelProps = {
  filters: SearchFiltersState;
  allCats: Category[];
};

const CategoryPanel = ({ filters, allCats }: CategoryPanelProps) => {
  return (
    <View className="flex-row flex-wrap gap-2">
      {allCats.map((c) => (
        <FilterOptionPill
          key={c.id}
          label={c.label}
          emoji={c.emoji}
          selected={filters.searchCategoryFilter.includes(c.code)}
          onPress={() => filters.toggleSearchCategory(c.code)}
        />
      ))}
    </View>
  );
};

export default CategoryPanel;
