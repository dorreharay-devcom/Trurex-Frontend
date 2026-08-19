import { describe, expect, it } from 'vitest';
import {
  fitsWithinRows,
  limitTagsToRows,
  overflowWidthForCount,
} from '~/features/discover/lib/discoverTagLayout';

const overflowWidthByDigits = {
  1: 32,
  2: 40,
  3: 48,
};

describe('discoverTagLayout', () => {
  it('shows all tags when they fit within two rows', () => {
    const tagWidths = [80, 80, 80, 80];
    const result = limitTagsToRows(tagWidths, 200, overflowWidthByDigits);

    expect(result).toEqual({ visibleCount: 4, hiddenCount: 0 });
  });

  it('hides extra tags and reserves space for +N on the second row', () => {
    const tagWidths = [170, 170, 170, 170, 170, 170];
    const rowWidth = 520;
    const gap = 6;

    const result = limitTagsToRows(tagWidths, rowWidth, overflowWidthByDigits);
    expect(result.hiddenCount).toBeGreaterThan(0);

    const visibleWidths = tagWidths.slice(0, result.visibleCount);
    const trailingWidth = overflowWidthForCount(result.hiddenCount, overflowWidthByDigits);

    expect(
      fitsWithinRows(visibleWidths, rowWidth, gap, 2, trailingWidth),
    ).toBe(true);
  });

  it('uses both rows before showing overflow', () => {
    const tagWidths = [180, 160, 150, 140, 130, 120, 110, 100];
    const rowWidth = 620;

    const result = limitTagsToRows(tagWidths, rowWidth, overflowWidthByDigits);

    expect(result.hiddenCount).toBeGreaterThan(0);
    expect(result.visibleCount).toBeGreaterThan(3);
  });
});
