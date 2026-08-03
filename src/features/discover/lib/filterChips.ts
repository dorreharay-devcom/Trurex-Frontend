import { TIME_FILTER_OPTIONS } from '~/features/discover/lib/filterOptions';
import { VALUE_FOR_MONEY_LABELS } from '~/shared/lib/recommendation';
import type { RecencyDayToken } from '~/features/discover/lib/searchParams';
import type { Category } from '~/features/discover/types';

type CategoryOption = Pick<Category, 'code' | 'label'>;

export type FilterChipId = 'budget' | 'quality' | 'category' | 'time';

export type FilterChip = {
  id: FilterChipId;
  label: string;
  active: boolean;
};

function budgetChipLabel(vfmFilter: number[]): string {
  if (vfmFilter.length === 0) return 'Budget';
  if (vfmFilter.length === 1) return VALUE_FOR_MONEY_LABELS[vfmFilter[0]! - 1] ?? 'Budget';
  return `Budget (${vfmFilter.length})`;
}

function qualityChipLabel(qualityFilter: number | null): string {
  if (qualityFilter == null) return 'Quality';
  return `Quality (${qualityFilter}★)`;
}

function categoryChipLabel(codes: string[], allCats: readonly CategoryOption[]): string {
  if (codes.length === 0) return 'Category';
  if (codes.length === 1) return allCats.find((c) => c.code === codes[0])?.label ?? 'Category';
  return `Category (${codes.length})`;
}

function timeChipLabel(days: RecencyDayToken[]): string {
  if (days.length === 0) return 'Time';
  if (days.length === 1) {
    return TIME_FILTER_OPTIONS.find((o) => o.days === days[0])?.label ?? 'Time';
  }
  return `Time (${days.length})`;
}

type BuildFilterChipsArgs = {
  vfmFilter: number[];
  qualityFilter: number | null;
  searchCategoryFilter: string[];
  recencyFilterDays: RecencyDayToken[];
  allCats: readonly CategoryOption[];
};

export function buildFilterChips({
  vfmFilter,
  qualityFilter,
  searchCategoryFilter,
  recencyFilterDays,
  allCats,
}: BuildFilterChipsArgs): FilterChip[] {
  return [
    {
      id: 'budget',
      label: budgetChipLabel(vfmFilter),
      active: vfmFilter.length > 0,
    },
    {
      id: 'quality',
      label: qualityChipLabel(qualityFilter),
      active: qualityFilter != null,
    },
    {
      id: 'category',
      label: categoryChipLabel(searchCategoryFilter, allCats),
      active: searchCategoryFilter.length > 0,
    },
    {
      id: 'time',
      label: timeChipLabel(recencyFilterDays),
      active: recencyFilterDays.length > 0,
    },
  ];
}
