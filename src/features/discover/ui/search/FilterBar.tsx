import React from 'react';
import { View } from 'react-native';
import type { SearchFiltersState } from '~/features/discover/hooks/useSearchFilters';
import FilterChipsRow from '~/features/discover/ui/search/FilterChipsRow';
import BudgetPanel from '~/features/discover/ui/search/BudgetPanel';
import QualityPanel from '~/features/discover/ui/search/QualityPanel';
import CategoryPanel from '~/features/discover/ui/search/CategoryPanel';
import TimePanel from '~/features/discover/ui/search/TimePanel';
import type { Category } from '~/features/discover/types';

type FilterBarProps = {
  filters: SearchFiltersState;
  allCats: Category[];
};

const FilterBar = ({ filters, allCats }: FilterBarProps) => {
  const { activeFilter } = filters;

  return (
    <View className="mb-5">
      <FilterChipsRow filters={filters} allCats={allCats} />

      {activeFilter && (
        <View className="p-4 bg-card border border-border rounded-xl mb-2">
          {activeFilter === 'budget' && <BudgetPanel filters={filters} />}
          {activeFilter === 'quality' && <QualityPanel filters={filters} />}
          {activeFilter === 'category' && <CategoryPanel filters={filters} allCats={allCats} />}
          {activeFilter === 'time' && <TimePanel filters={filters} />}
        </View>
      )}
    </View>
  );
};

export default FilterBar;
