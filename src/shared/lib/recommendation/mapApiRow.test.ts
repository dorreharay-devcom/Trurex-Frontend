import { describe, expect, it } from 'vitest';
import {
  mapApiRowToRecommendation,
  recommendationStub,
} from '~/shared/lib/recommendation/mapApiRow';

describe('mapApiRowToRecommendation', () => {
  it('returns stub and rejects non-objects / missing id', () => {
    expect(recommendationStub('r1').id).toBe('r1');
    expect(mapApiRowToRecommendation(null)).toBeNull();
    expect(mapApiRowToRecommendation({})).toBeNull();
  });

  it('maps full api row aliases', () => {
    const rec = mapApiRowToRecommendation({
      rex_id: 'r1',
      place_name: 'Cafe',
      review: 'great',
      category_code: 'food_drink',
      category_name: 'Food',
      author_display_name: 'Alex',
      author_handle: 'alex',
      author_avatar_url: 'https://img/a.png',
      user_id: 'u1',
      photo_paths: ['path/1.jpg'],
      image: 'https://cdn/x.jpg',
      latitude: '-33.8',
      longitude: 151.2,
      overall_rating: 4.5,
      score_value_for_money: 3,
      tag_names: ['cozy'],
      like_count: 2,
      comment_count: 1,
      save_count: 0,
      liked_by_me: true,
      saved_by_me: false,
      is_online_place: true,
      place_website_url: 'https://ex.com',
      created_at: '2024-01-01',
    });
    expect(rec).toMatchObject({
      id: 'r1',
      title: 'Cafe',
      description: 'great',
      categoryId: 'food_drink',
      category: 'Food',
      authorId: 'u1',
      rating: 4.5,
      scoreValueForMoney: 3,
      isLiked: true,
      isSaved: false,
      isOnlinePlace: true,
      latitude: -33.8,
      longitude: 151.2,
      photoPath: 'path/1.jpg',
      image: 'https://cdn/x.jpg',
    });
    expect(rec?.user?.handle).toBe('@alex');
    expect(rec?.tags).toEqual(['cozy']);
  });

  it('falls back category label from code', () => {
    const rec = mapApiRowToRecommendation({ id: 'r2', category_code: 'food_drink' });
    expect(rec?.categoryId).toBe('food_drink');
    expect(rec?.category).toBe('food drink');
  });
});
