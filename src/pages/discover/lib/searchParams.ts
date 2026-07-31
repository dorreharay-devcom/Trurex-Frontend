import { getRexCategoryApiCode } from '~/constants/recommendation/rexCategories';
import { ALL_CATEGORIES } from '~/pages/discover/types';

export const ALL_TIME_DAYS = 9999;

export type RecencyDayToken = 1 | 7 | 30 | typeof ALL_TIME_DAYS;

type ConcreteRecencyDays = Exclude<RecencyDayToken, typeof ALL_TIME_DAYS>;

export type CreatedBounds = {
  created_from: string | null;
  created_to: string | null;
};

const NO_BOUNDS: CreatedBounds = { created_from: null, created_to: null };

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const VFM_ALL = [1, 2, 3, 4, 5] as const;
const VFM_MIN = 1;
const VFM_MAX = 5;

function startOfLocalDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function recencyStartMs(days: ConcreteRecencyDays, now: Date): number {
  if (days === 1) {
    return startOfLocalDay(now).getTime();
  }
  return now.getTime() - days * MS_PER_DAY;
}

export function recencyDaysToCreatedBounds(days: RecencyDayToken[]): CreatedBounds {
  const concrete = days.filter((d): d is ConcreteRecencyDays => d !== ALL_TIME_DAYS);
  if (concrete.length === 0) {
    return NO_BOUNDS;
  }
  const now = new Date();
  const earliestStartMs = Math.min(...concrete.map((d) => recencyStartMs(d, now)));
  return {
    created_from: new Date(earliestStartMs).toISOString(),
    created_to: now.toISOString(),
  };
}

export function effectiveCategoryFilter(
  categoryId: string,
  searchCategoryFilter: string[],
): string | null {
  if (searchCategoryFilter.length === 1) {
    return getRexCategoryApiCode(searchCategoryFilter[0]!);
  }
  if (searchCategoryFilter.length > 1) {
    return null;
  }
  if (categoryId === ALL_CATEGORIES) {
    return null;
  }
  return getRexCategoryApiCode(categoryId);
}

export function vfmForRpc(filters: number[]): number[] | null {
  if (filters.length === 0) {
    return null;
  }
  const allSelected =
    filters.length === VFM_ALL.length && VFM_ALL.every((n) => filters.includes(n));
  if (allSelected) {
    return null;
  }
  return [...new Set(filters)].filter((n) => n >= VFM_MIN && n <= VFM_MAX).sort((a, b) => a - b);
}
