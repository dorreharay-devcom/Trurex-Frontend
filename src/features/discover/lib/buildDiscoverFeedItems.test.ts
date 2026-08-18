import { describe, expect, it } from 'vitest';
import {
  buildDiscoverFeedItems,
  PEOPLE_SUGGESTIONS_AFTER_REX_COUNT,
} from '~/features/discover/lib/buildDiscoverFeedItems';
import type { Recommendation } from '~/shared/types/recommendation';

function fakeRec(id: string): Recommendation {
  return { id } as Recommendation;
}

describe('buildDiscoverFeedItems', () => {
  it('returns only rex items when people suggestions are disabled', () => {
    const rows = [fakeRec('1'), fakeRec('2')];
    expect(buildDiscoverFeedItems(rows)).toEqual([
      { type: 'rex', id: '1', recommendation: rows[0] },
      { type: 'rex', id: '2', recommendation: rows[1] },
    ]);
  });

  it('inserts people suggestions after the configured rex count', () => {
    const rows = Array.from({ length: PEOPLE_SUGGESTIONS_AFTER_REX_COUNT + 1 }, (_, i) =>
      fakeRec(String(i + 1)),
    );
    const items = buildDiscoverFeedItems(rows, { includePeopleSuggestions: true });
    expect(items[PEOPLE_SUGGESTIONS_AFTER_REX_COUNT - 1]?.type).toBe('rex');
    expect(items[PEOPLE_SUGGESTIONS_AFTER_REX_COUNT]).toEqual({
      type: 'people_suggestions',
      id: 'people_suggestions',
    });
    expect(items[PEOPLE_SUGGESTIONS_AFTER_REX_COUNT + 1]?.type).toBe('rex');
  });

  it('does not insert people suggestions when there are fewer rexes than the threshold', () => {
    const rows = Array.from({ length: PEOPLE_SUGGESTIONS_AFTER_REX_COUNT - 1 }, (_, i) =>
      fakeRec(String(i + 1)),
    );
    const items = buildDiscoverFeedItems(rows, { includePeopleSuggestions: true });
    expect(items.every((item) => item.type === 'rex')).toBe(true);
  });
});
