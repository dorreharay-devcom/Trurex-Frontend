import { useCallback, useMemo, useState } from 'react';
import { DollarSign, Tag, Clock, Star } from 'lucide-react-native';
import type { Recommendation } from '~/types/recommendation/recommendation';
import { useSearchRexes, type RecencyDayToken } from '~/hooks/useDiscovery';
import { DEFAULT_SEARCH_DEBOUNCE_MS, useDebouncedValue } from '~/hooks/useDebouncedValue';
import { VALUE_FOR_MONEY_LABELS } from '~/utils/recommendation/recContentDisplay';

export const DISCOVER_VALUE_LABELS = VALUE_FOR_MONEY_LABELS;

export const DISCOVER_TIME_FILTER_OPTIONS: { label: string; days: RecencyDayToken }[] = [
  { label: 'Today', days: 1 },
  { label: 'This week', days: 7 },
  { label: 'This month', days: 30 },
  { label: 'All time', days: 9999 },
];

type CategoryLite = { code: string; label: string };

type IconComp = typeof DollarSign;

type FilterChip = {
  id: 'budget' | 'quality' | 'category' | 'time';
  label: string;
  active: boolean;
  Icon: IconComp;
};

type UseDiscoverSearchFiltersArgs = {
  searchQuery: string;
  activeCategory: string;
  allCats: readonly CategoryLite[];
};

export function useDiscoverSearchFilters({
  searchQuery,
  activeCategory,
  allCats,
}: UseDiscoverSearchFiltersArgs) {
  const [vfmFilter, setVfmFilter] = useState<number[]>([]);
  const [qualityFilter, setQualityFilter] = useState<number | null>(null);
  const [searchCategoryFilter, setSearchCategoryFilter] = useState<string[]>([]);
  const [recencyFilterDays, setRecencyFilterDays] = useState<RecencyDayToken[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const hasSearch = searchQuery.trim().length > 0;
  const debouncedSearchQuery = useDebouncedValue(searchQuery, DEFAULT_SEARCH_DEBOUNCE_MS);
  const hasDebouncedSearch = debouncedSearchQuery.trim().length > 0;

  const { data: searchData, isLoading: searchLoading } = useSearchRexes(
    {
      searchTerm: debouncedSearchQuery,
      categoryId: activeCategory,
      searchCategoryFilter,
      valueForMoneyFilters: vfmFilter,
      qualityFilter,
      recencyFilterDays,
    },
    { enabled: hasDebouncedSearch },
  );

  const searchRows = useMemo((): Recommendation[] => {
    const list = (searchData ?? []) as Recommendation[];
    if (searchCategoryFilter.length > 1) {
      const s = new Set(searchCategoryFilter);
      return list.filter((r) => s.has(r.categoryId));
    }
    return list;
  }, [searchData, searchCategoryFilter]);

  const hasActiveSearchFilters = useMemo(
    () =>
      vfmFilter.length > 0 ||
      qualityFilter != null ||
      searchCategoryFilter.length > 0 ||
      recencyFilterDays.length > 0,
    [vfmFilter, qualityFilter, searchCategoryFilter, recencyFilterDays],
  );

  const clearAllFilters = useCallback(() => {
    setVfmFilter([]);
    setQualityFilter(null);
    setSearchCategoryFilter([]);
    setRecencyFilterDays([]);
    setActiveFilter(null);
  }, []);

  const toggleVfm = useCallback((val: number) => {
    setVfmFilter((prev) => {
      const next = prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val];
      return next.sort((a, b) => a - b);
    });
  }, []);

  const toggleQuality = useCallback((star: number) => {
    setQualityFilter((prev) => (prev === star ? null : star));
  }, []);

  const toggleSearchCategory = useCallback((code: string) => {
    setSearchCategoryFilter((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  }, []);

  const toggleRecencyDay = useCallback((d: RecencyDayToken) => {
    setRecencyFilterDays((prev) => (prev.includes(d) ? [] : [d]));
  }, []);

  const filterChips: FilterChip[] = useMemo(() => {
    const budgetLabel = (() => {
      if (vfmFilter.length === 0) return 'Budget';
      if (vfmFilter.length === 1) {
        const v = vfmFilter[0]!;
        return DISCOVER_VALUE_LABELS[v - 1] ?? 'Budget';
      }
      return `Budget (${vfmFilter.length})`;
    })();

    const timeLabel = (() => {
      if (recencyFilterDays.length === 0) return 'Time';
      if (recencyFilterDays.length === 1) {
        const d = recencyFilterDays[0]!;
        return DISCOVER_TIME_FILTER_OPTIONS.find((o) => o.days === d)?.label ?? 'Time';
      }
      return `Time (${recencyFilterDays.length})`;
    })();

    return [
      {
        id: 'budget',
        label: budgetLabel,
        active: vfmFilter.length > 0,
        Icon: DollarSign,
      },
      {
        id: 'quality',
        label: qualityFilter != null ? `Quality (${qualityFilter}★)` : 'Quality',
        active: qualityFilter != null,
        Icon: Star,
      },
      {
        id: 'category',
        label: (() => {
          if (searchCategoryFilter.length === 0) return 'Category';
          if (searchCategoryFilter.length === 1) {
            return allCats.find((c) => c.code === searchCategoryFilter[0])?.label ?? 'Category';
          }
          return `Category (${searchCategoryFilter.length})`;
        })(),
        active: searchCategoryFilter.length > 0,
        Icon: Tag,
      },
      {
        id: 'time',
        label: timeLabel,
        active: recencyFilterDays.length > 0,
        Icon: Clock,
      },
    ];
  }, [vfmFilter, qualityFilter, searchCategoryFilter, recencyFilterDays, allCats]);

  return {
    hasSearch,
    searchRows,
    searchLoading,
    vfmFilter,
    qualityFilter,
    searchCategoryFilter,
    recencyFilterDays,
    activeFilter,
    setActiveFilter,
    toggleVfm,
    toggleQuality,
    toggleSearchCategory,
    toggleRecencyDay,
    clearAllFilters,
    hasActiveSearchFilters,
    filterChips,
  };
}
