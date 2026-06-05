import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { Recommendation } from '~/types/recommendation/recommendation';
import type { RexDetailRow } from '~/types/recommendation/rexDetail';
import { unknownErrorMessage } from '~/utils';
import { averageScoreFromCategoryRatings } from '~/utils/recommendation/recContentDisplay';

dayjs.extend(relativeTime);

function normalizeHandle(raw: string | null): string {
  if (!raw) return '';
  const t = raw.trim();
  if (!t) return '';
  return t.startsWith('@') ? t : `@${t}`;
}

export function rexDetailRowToRecommendation(row: RexDetailRow): Recommendation {
  const photoPaths = row.photo_paths?.filter((p) => p.trim().length > 0) ?? [];
  const photoPath = photoPaths[0] ?? null;
  const bodyText = row.review ?? row.description ?? row.must_know ?? row.quick_tip ?? null;
  const rating = averageScoreFromCategoryRatings(row.category_ratings);

  return {
    id: row.id,
    title: row.place_name?.trim() || 'Place',
    description: bodyText,
    photoPath: photoPath ?? undefined,
    photoPaths: photoPaths.length > 0 ? photoPaths : undefined,
    photoCount: photoPaths.length,
    placeholderColors: row.placeholder_colors?.map((c) => c.trim()).filter(Boolean) ?? null,
    categoryId: row.category_code || 'all',
    category: row.category_name?.trim() || 'Uncategorized',
    categoryIcon: row.category_icon,
    authorId: row.author_id,
    location: row.place_location?.trim() || undefined,
    placeWebsiteUrl: row.place_website_url?.trim() || null,
    isOnlinePlace: row.is_online_place ?? null,
    rating: rating ?? null,
    scoreValueForMoney: row.score_value_for_money,
    tags: row.tag_slugs?.length ? row.tag_slugs : null,
    user: {
      name: row.author_display_name?.trim() || 'Member',
      handle: normalizeHandle(row.author_username),
      avatar: row.author_profile_picture_url?.trim() ?? '',
    },
    timeAgo: row.created_at && dayjs(row.created_at).isValid() ? dayjs(row.created_at).fromNow() : '',
    likes: row.like_count ?? 0,
    comments: row.comment_count ?? 0,
    saves: 0,
    isLiked: row.liked_by_me ?? false,
    isSaved: row.is_saved ?? false,
  };
}

export function deleteRexToastMessage(err: unknown): string {
  const e = err as { code?: string; message?: string };
  if (e?.code === 'P0002') {
    return 'This recommendation was already removed or you don’t have permission to delete it.';
  }
  return unknownErrorMessage(err, 'Try again.');
}
