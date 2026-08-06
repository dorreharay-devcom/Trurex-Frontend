import { describe, expect, it } from 'vitest';
import {
  ALL_TIME_DAYS,
  effectiveCategoryFilter,
  recencyDaysToCreatedBounds,
  vfmForRpc,
} from '~/features/discover/lib/searchParams';
import { ALL_CATEGORIES } from '~/features/discover/types';

describe('searchParams', () => {
  it('builds recency bounds', () => {
    expect(recencyDaysToCreatedBounds([ALL_TIME_DAYS])).toEqual({
      created_from: null,
      created_to: null,
    });
    const week = recencyDaysToCreatedBounds([7]);
    expect(week.created_from).toBeTruthy();
    expect(week.created_to).toBeTruthy();
    const day = recencyDaysToCreatedBounds([1, 30]);
    expect(new Date(day.created_from!).getTime()).toBeLessThan(new Date(day.created_to!).getTime());
  });

  it('maps category filter + vfm', () => {
    expect(effectiveCategoryFilter(ALL_CATEGORIES, [])).toBeNull();
    expect(effectiveCategoryFilter('x', ['a', 'b'])).toBeNull();
    expect(effectiveCategoryFilter(ALL_CATEGORIES, ['food_drink'])).toBe('food_drink');
    expect(effectiveCategoryFilter('food_drink', [])).toBe('food_drink');
    expect(vfmForRpc([])).toBeNull();
    expect(vfmForRpc([1, 2, 3, 4, 5])).toBeNull();
    expect(vfmForRpc([5, 1, 1, 9])).toEqual([1, 5]);
  });
});
