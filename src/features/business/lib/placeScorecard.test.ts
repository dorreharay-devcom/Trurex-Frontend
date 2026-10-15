import { describe, expect, it } from 'vitest';
import { buildScorecardRows } from '~/features/business/lib/placeScorecard';

describe('buildScorecardRows', () => {
  it('drops non-numeric scores and sorts by label', () => {
    expect(
      buildScorecardRows({
        b: { label: 'Breakfast', avg_score: 4.5, scored_count: 2 },
        a: { label: 'Admin', avg_score: 5, scored_count: 1 },
        n: { label: 'Broken', avg_score: Number.NaN, scored_count: 1 },
      }),
    ).toEqual([
      { label: 'Admin', value: 5 },
      { label: 'Breakfast', value: 4.5 },
    ]);
  });
});
