import { describe, expect, it } from 'vitest';
import {
  patchInfiniteRecommendations,
  patchRecommendationList,
} from '~/shared/lib/query/patchRecommendationList';
import type { Recommendation } from '~/shared/types/recommendation';

const rec = (id: string, likes = 1): Recommendation => ({
  id,
  title: id,
  categoryId: 'c',
  category: 'c',
  likes,
  comments: 0,
  saves: 0,
  isLiked: false,
  isSaved: false,
});

describe('patchRecommendationList identity stability', () => {
  it('returns same array when id missing', () => {
    const list = [rec('a'), rec('b')];
    expect(patchRecommendationList(list, 'missing', { likes: 9 })).toBe(list);
  });

  it('returns same undefined for empty input', () => {
    expect(patchRecommendationList(undefined, 'a', { likes: 1 })).toBeUndefined();
    expect(patchRecommendationList([], 'a', { likes: 1 })).toEqual([]);
  });

  it('returns same infinite data when no page changes', () => {
    const data = { pages: [[rec('a')]], pageParams: [0] };
    expect(patchInfiniteRecommendations(data, 'z', { likes: 2 })).toBe(data);
  });

  it('patches infinite pages without cloning unchanged identity of whole data when changed', () => {
    const data = { pages: [[rec('a'), rec('b')]], pageParams: [0] };
    const next = patchInfiniteRecommendations(data, 'b', { likes: 5 });
    expect(next).not.toBe(data);
    expect(next?.pages[0]?.[1]).toMatchObject({ id: 'b', likes: 5 });
    expect(next?.pages[0]?.[0]).toBe(data.pages[0][0]);
  });
});
