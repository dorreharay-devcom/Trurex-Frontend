import { describe, expect, it } from 'vitest';
import { buildFilterChips } from '~/features/discover/lib/filterChips';

describe('filterChips', () => {
  it('labels inactive and active filter chips', () => {
    const idle = buildFilterChips({
      vfmFilter: [],
      qualityFilter: null,
      searchCategoryFilter: [],
      recencyFilterDays: [],
      allCats: [{ code: 'food_drink', label: 'Food' }],
    });
    expect(idle.every((c) => !c.active)).toBe(true);

    const active = buildFilterChips({
      vfmFilter: [1, 2],
      qualityFilter: 4,
      searchCategoryFilter: ['food_drink'],
      recencyFilterDays: [7],
      allCats: [{ code: 'food_drink', label: 'Food' }],
    });
    expect(active.find((c) => c.id === 'budget')?.label).toContain('Budget');
    expect(active.find((c) => c.id === 'quality')?.label).toBe('Quality (4★)');
    expect(active.find((c) => c.id === 'category')?.label).toBe('Food');
    expect(active.every((c) => c.active)).toBe(true);

    const singleBudget = buildFilterChips({
      vfmFilter: [1],
      qualityFilter: null,
      searchCategoryFilter: ['missing'],
      recencyFilterDays: [9999 as never],
      allCats: [],
    });
    expect(singleBudget.find((c) => c.id === 'budget')?.label).toBeTruthy();
    expect(singleBudget.find((c) => c.id === 'category')?.label).toBe('Category');
    expect(singleBudget.find((c) => c.id === 'time')?.label).toBeTruthy();

    const multi = buildFilterChips({
      vfmFilter: [1],
      qualityFilter: null,
      searchCategoryFilter: ['a', 'b'],
      recencyFilterDays: [1, 7],
      allCats: [],
    });
    expect(multi.find((c) => c.id === 'category')?.label).toBe('Category (2)');
    expect(multi.find((c) => c.id === 'time')?.label).toBe('Time (2)');
  });
});
