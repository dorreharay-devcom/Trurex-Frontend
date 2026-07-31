import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DollarSign, Tag, Clock, Star } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import type { SearchFiltersState } from '~/pages/discover/hooks/useSearchFilters';
import { buildFilterChips, type FilterChipId } from '~/pages/discover/lib/filterChips';
import type { Category } from '~/pages/discover/types';

const chipPillClass = 'flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border';

const FILTER_CHIP_ICONS: Record<FilterChipId, typeof DollarSign> = {
  budget: DollarSign,
  quality: Star,
  category: Tag,
  time: Clock,
};

type FilterChipsRowProps = {
  filters: SearchFiltersState;
  allCats: Category[];
};

const FilterChipsRow = ({ filters, allCats }: FilterChipsRowProps) => {
  const { activeFilter, setActiveFilter } = filters;

  const filterChips = buildFilterChips({
    vfmFilter: filters.vfmFilter,
    qualityFilter: filters.qualityFilter,
    searchCategoryFilter: filters.searchCategoryFilter,
    recencyFilterDays: filters.recencyFilterDays,
    allCats,
  });

  return (
    <View className="mb-2 flex-row flex-wrap items-center gap-2">
      {filterChips.map((chip) => {
        const Icon = FILTER_CHIP_ICONS[chip.id];
        const isOpen = activeFilter === chip.id;
        const isHighlighted = chip.active || isOpen;
        const chipClass = isHighlighted
          ? 'bg-primary/10 border-primary/40'
          : 'bg-card border-border';
        return (
          <TouchableOpacity
            key={chip.id}
            onPress={() => setActiveFilter(isOpen ? null : chip.id)}
            activeOpacity={0.7}
            className={`${chipPillClass} ${chipClass}`}
          >
            <Icon size={12} color={Theme.colors.foreground} />
            <Text className="text-xs font-medium text-foreground">{chip.label}</Text>
          </TouchableOpacity>
        );
      })}
      {filters.hasActiveSearchFilters && (
        <TouchableOpacity onPress={filters.clearAllFilters} className="px-2 py-1.5">
          <Text className="text-xs font-medium text-destructive">Clear all</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FilterChipsRow;
