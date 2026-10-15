import { describe, expect, it } from 'vitest';
import { isListCollapsible, visibleListItems } from '~/shared/lib/data/collapsibleList';

const items = (count: number) => Array.from({ length: count }, (_, i) => i);

describe('isListCollapsible', () => {
  it('collapses only above the collapsed count', () => {
    expect(isListCollapsible(items(5), 5)).toBe(false);
    expect(isListCollapsible(items(6), 5)).toBe(true);
  });
});

describe('visibleListItems', () => {
  it('limits items while collapsed', () => {
    expect(visibleListItems(items(12), false, 5)).toEqual([0, 1, 2, 3, 4]);
  });

  it('returns every item when expanded', () => {
    const all = items(12);
    expect(visibleListItems(all, true, 5)).toBe(all);
  });
});
