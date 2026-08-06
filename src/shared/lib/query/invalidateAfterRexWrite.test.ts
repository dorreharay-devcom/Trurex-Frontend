import { describe, expect, it } from 'vitest';
import {
  AFTER_CREATE_FEED_KEYS,
  AFTER_CREATE_MAP_KEYS,
  CREATE_MUST_NOT_INVALIDATE,
  prependRecommendationPage,
} from '~/shared/lib/query/invalidateAfterRexWrite';
import { REX_QUERY_KEYS } from '~/shared/config/queryKeys';
import type { Recommendation } from '~/shared/types/recommendation';

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

describe('invalidateAfterRexWrite surfaces', () => {
  it('refreshes map + feed surfaces', () => {
    expect(AFTER_CREATE_MAP_KEYS).toContain(REX_QUERY_KEYS.mapRexPins);
    expect(AFTER_CREATE_FEED_KEYS).toContain(REX_QUERY_KEYS.myRexes);
    expect(AFTER_CREATE_FEED_KEYS).toContain(REX_QUERY_KEYS.discoverFeed);
  });

  it('never targets gems/saved lists', () => {
    expect(CREATE_MUST_NOT_INVALIDATE).toContain(REX_QUERY_KEYS.mySavedRexes);
    expect(AFTER_CREATE_FEED_KEYS).not.toContain(REX_QUERY_KEYS.mySavedRexes);
    expect(AFTER_CREATE_MAP_KEYS).not.toContain(REX_QUERY_KEYS.mySavedRexes);
  });
});

describe('prependRecommendationPage', () => {
  it('inserts at head of first page', () => {
    const data = {
      pages: [[stub('a'), stub('b')]],
      pageParams: [0],
    };
    const next = prependRecommendationPage(data, stub('new'));
    expect(next?.pages[0]?.map((r) => r.id)).toEqual(['new', 'a', 'b']);
  });

  it('is idempotent for duplicate id', () => {
    const data = { pages: [[stub('a')]], pageParams: [0] };
    const next = prependRecommendationPage(data, stub('a'));
    expect(next).toBe(data);
  });
});
