import { describe, expect, it } from 'vitest';
import {
  patchInfiniteRecommendations,
  patchRecommendationList,
} from '~/shared/lib/query/patchRecommendationList';
import type { Recommendation } from '~/shared/types/recommendation';

const rec = (id: string, likes = 1, liked = false): Recommendation => ({
  id,
  title: id,
  categoryId: 'c',
  category: 'c',
  likes,
  comments: 0,
  saves: 0,
  isLiked: liked,
  isSaved: false,
});

describe('patchFeedLike rollback helpers', () => {
  it('patches matching list rows', () => {
    const list = [rec('a', 1, false), rec('b', 2, true)];
    const next = patchRecommendationList(list, 'a', { isLiked: true, likes: 2 });
    expect(next?.[0]).toMatchObject({ id: 'a', isLiked: true, likes: 2 });
    expect(next?.[1]).toEqual(list[1]);
  });

  it('rolls like back on failure path shape', () => {
    const list = [rec('a', 3, true)];
    const optimistic = patchRecommendationList(list, 'a', { isLiked: false, likes: 2 });
    const rolled = patchRecommendationList(optimistic, 'a', { isLiked: true, likes: 3 });
    expect(rolled?.[0]).toMatchObject({ isLiked: true, likes: 3 });
  });

  it('patches infinite first page', () => {
    const data = { pages: [[rec('a'), rec('b')]], pageParams: [0] };
    const next = patchInfiniteRecommendations(data, 'b', { likes: 9, isLiked: true });
    expect(next?.pages[0]?.[1]).toMatchObject({ id: 'b', likes: 9, isLiked: true });
  });
});
