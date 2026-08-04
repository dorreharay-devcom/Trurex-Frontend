import React from 'react';
import { View } from 'react-native';
import type { SearchFiltersState } from '~/features/discover/hooks/useSearchFilters';
import { TIME_FILTER_OPTIONS } from '~/features/discover/lib/filterOptions';
import FilterOptionPill from '~/features/discover/ui/search/FilterOptionPill';

const TimePanel = ({ filters }: { filters: SearchFiltersState }) => {
  return (
    <View className="flex-row flex-wrap gap-2">
      {TIME_FILTER_OPTIONS.map((o) => (
        <FilterOptionPill
          key={o.days}
          label={o.label}
          selected={filters.recencyFilterDays.includes(o.days)}
          onPress={() => filters.toggleRecencyDay(o.days)}
        />
      ))}
    </View>
  );
};

export default TimePanel;
