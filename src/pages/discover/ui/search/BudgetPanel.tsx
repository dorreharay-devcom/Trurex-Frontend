import React from 'react';
import { View } from 'react-native';
import type { SearchFiltersState } from '~/pages/discover/hooks/useSearchFilters';
import { VALUE_LABELS } from '~/pages/discover/lib/filterOptions';
import FilterOptionPill from '~/pages/discover/ui/search/FilterOptionPill';

const BudgetPanel = ({ filters }: { filters: SearchFiltersState }) => {
  return (
    <View className="flex-row flex-wrap gap-2">
      {VALUE_LABELS.map((label, i) => {
        const val = i + 1;
        return (
          <FilterOptionPill
            key={val}
            label={label}
            selected={filters.vfmFilter.includes(val)}
            onPress={() => filters.toggleVfm(val)}
          />
        );
      })}
    </View>
  );
};

export default BudgetPanel;
