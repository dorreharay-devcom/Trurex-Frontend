import { useCallback, useMemo, useState } from 'react';
import { DollarSign, Tag, Clock } from 'lucide-react-native';
import type { Recommendation } from '~/types/recommendation/recommendation';
import { useSearchRexes, type RecencyDayToken } from '~/hooks/useDiscovery';

export const DISCOVER_VALUE_LABELS = [
  'Total Steal',
  'Budget-Friendly',
  'Good Value',
  'Worth It',
  'Splurge',
] as const;

export const DISCOVER_TIME_FILTER_OPTIONS: { label: string; days: RecencyDayToken }[] = [
  { label: 'Today', days: 1 },
  { label: 'This week', days: 7 },
  { label: 'This month', days: 30 },
  { label: 'All time', days: 9999 },
];

type CategoryLite = { code: string; label: string };

type IconComp = typeof DollarSign;

type FilterChip = {
  id: 'budget' | 'category' | 'time';
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
  const [searchCategoryFilter, setSearchCategoryFilter] = useState<string[]>([]);
  const [recencyFilterDays, setRecencyFilterDays] = useState<RecencyDayToken[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const hasSearch = searchQuery.trim().length > 0;

  const { data: searchData, isLoading: searchLoading } = useSearchRexes(
    {
      searchTerm: searchQuery,
      categoryId: activeCategory,
      searchCategoryFilter,
      valueForMoneyFilters: vfmFilter,
      recencyFilterDays,
    },
    { enabled: hasSearch },
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
    () => vfmFilter.length > 0 || searchCategoryFilter.length > 0 || recencyFilterDays.length > 0,
    [vfmFilter, searchCategoryFilter, recencyFilterDays],
  );

  const clearAllFilters = useCallback(() => {
    setVfmFilter([]);
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

  const toggleSearchCategory = useCallback((code: string) => {
    setSearchCategoryFilter((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  }, []);

  const toggleRecencyDay = useCallback((d: RecencyDayToken) => {
    setRecencyFilterDays((prev) => {
      const next = prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d];
      return (next as RecencyDayToken[]).sort((a, b) => a - b);
    });
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
  }, [vfmFilter, searchCategoryFilter, recencyFilterDays, allCats]);

  return {
    hasSearch,
    searchRows,
    searchLoading,
    vfmFilter,
    searchCategoryFilter,
    recencyFilterDays,
    activeFilter,
    setActiveFilter,
    toggleVfm,
    toggleSearchCategory,
    toggleRecencyDay,
    clearAllFilters,
    hasActiveSearchFilters,
    filterChips,
  };
}
