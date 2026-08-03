import { useCallback, useMemo, useState } from 'react';
import type { RecencyDayToken } from '~/features/discover/lib/searchParams';
import type { FilterChipId } from '~/features/discover/lib/filterChips';

export type SearchFiltersState = ReturnType<typeof useSearchFilters>;

export function useSearchFilters() {
  const [vfmFilter, setVfmFilter] = useState<number[]>([]);
  const [qualityFilter, setQualityFilter] = useState<number | null>(null);
  const [searchCategoryFilter, setSearchCategoryFilter] = useState<string[]>([]);
  const [recencyFilterDays, setRecencyFilterDays] = useState<RecencyDayToken[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterChipId | null>(null);

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

  return {
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
  };
}
