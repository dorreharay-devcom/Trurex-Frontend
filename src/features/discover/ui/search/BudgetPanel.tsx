import React from 'react';
import { View } from 'react-native';
import type { SearchFiltersState } from '~/features/discover/hooks/useSearchFilters';
import { VALUE_FOR_MONEY_LABELS } from '~/shared/lib/recommendation';
import FilterOptionPill from '~/features/discover/ui/search/FilterOptionPill';

const BudgetPanel = ({ filters }: { filters: SearchFiltersState }) => {
  return (
    <View className="flex-row flex-wrap gap-2">
      {VALUE_FOR_MONEY_LABELS.map((label, i) => {
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
