import type { CollectionRexEntry } from '~/features/collections/types/collection';
import type { RecSummary } from '~/features/collections/types/recSummary';
import type { Recommendation } from '~/shared/types/recommendation';

export function entryToRecommendation(entry: CollectionRexEntry): Recommendation {
  return {
    id: entry.rex_id,
    title: entry.place_name,
    categoryId: entry.category_code,
    category: entry.category_name ?? entry.category_code,
    categoryIcon: entry.category_icon ?? null,
    photoPath: entry.photo_path,
    placeholderColors: entry.placeholder_colors ?? null,
    location: entry.location ?? undefined,
    placeWebsiteUrl: entry.place_website_url?.trim() || null,
    isOnlinePlace: entry.is_online_place ?? null,
    rating: entry.overall_rating ?? entry.rating ?? undefined,
    scoreValueForMoney: entry.score_value_for_money ?? undefined,
    user:
      entry.recommender_name || entry.recommender_handle
        ? { name: entry.recommender_name ?? '', handle: entry.recommender_handle ?? '', avatar: '' }
        : null,
    timeAgo: '',
    likes: 0,
    comments: 0,
    saves: 0,
    isLiked: false,
    isSaved: true,
  };
}

export function toRecSummary(rec: Recommendation): RecSummary {
  return {
    id: rec.id,
    place_name: rec.title,
    category_code: rec.categoryId,
    location: rec.location,
    isSaved: rec.isSaved,
  };
}
