import { describe, expect, it, vi } from 'vitest';
import {
  invalidateAfterRexWrite,
  prependMapPinToCaches,
  prependRecommendationPage,
  prependRecommendationToFeedCaches,
} from '~/shared/lib/query/invalidateAfterRexWrite';
import { REX_QUERY_KEYS } from '~/shared/config/queryKeys';
import type { Recommendation } from '~/shared/types/recommendation';
import type { MapPinRow } from '~/features/map/types/mapPinRow';
import type { QueryClient } from '@tanstack/react-query';

const stub = (id: string): Recommendation => ({
  id,
  title: 't',
  categoryId: 'c',
  category: 'c',
  likes: 0,
  comments: 0,
  saves: 0,
  isLiked: false,
  isSaved: false,
});

const pin = (rexId: string): MapPinRow => ({
  rex_id: rexId,
  place_id: 'p',
  place_name: 'Cafe',
  place_rex_author_count: 1,
  latitude: 1,
  longitude: 2,
  category_code: 'food',
  category_name: 'Food',
  category_icon: null,
  category_color: null,
  is_saved: false,
  pin_type: 'default',
});

function mockQueryClient() {
  return {
    invalidateQueries: vi.fn(),
    setQueriesData: vi.fn(
      (opts: { queryKey: readonly unknown[] }, updater: (data: unknown) => unknown) => {
        const root = opts.queryKey[0];
        if (root === REX_QUERY_KEYS.discoverFeed[0] || root === REX_QUERY_KEYS.myRexes[0]) {
          updater(undefined);
          updater({ pages: [[stub('a')]], pageParams: [0] });
          updater({ pages: [[stub('n')]], pageParams: [0] });
          return;
        }
        if (root === REX_QUERY_KEYS.mapRexPins[0]) {
          updater(undefined);
          updater([pin('existing')]);
          updater([pin('dup')]);
        }
      },
    ),
  } as unknown as QueryClient;
}

describe('invalidateAfterRexWrite runtime', () => {
  it('invalidates map/feed and edit keys', () => {
    const qc = mockQueryClient();
    invalidateAfterRexWrite(qc);
    expect(qc.invalidateQueries).toHaveBeenCalled();
    invalidateAfterRexWrite(qc, { editRexId: 'rex-1' });
    expect(qc.invalidateQueries).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['rexDetail', 'rex-1'] }),
    );
  });

  it('prepends empties and feeds/map caches', () => {
    expect(prependRecommendationPage(undefined, stub('n'))?.pages[0]?.[0]?.id).toBe('n');
    const qc = mockQueryClient();
    prependRecommendationToFeedCaches(qc, stub('n'));
    prependMapPinToCaches(qc, pin('n'));
    expect(qc.setQueriesData).toHaveBeenCalled();
  });
});
