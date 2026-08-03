import type { Recommendation, RecommendationAuthor } from '~/shared/types/recommendation';
import {
  coerceStringList,
  firstBoolean,
  firstFiniteNumber,
  firstFiniteNumberInInclusiveRange,
  firstNonEmptyString,
  firstPositiveFiniteNumber,
  isHttpUrl,
  isPlainObject,
  optionalFiniteNumber,
  parseRelationshipStatus,
} from '~/shared/lib/data/guards';

function nonEmptyStringList(raw: unknown): string[] | null {
  const values = coerceStringList(raw);
  return values.length > 0 ? values : null;
}

function withHandlePrefix(raw: string | null): string {
  if (!raw) return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';
  return trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
}

function optionalBoolean(
  record: Record<string, unknown>,
  ...keys: string[]
): boolean | null {
  for (const key of keys) {
    const raw = record[key];
    if (typeof raw === 'boolean') return raw;
  }
  return null;
}

function mapAuthor(row: Record<string, unknown>): RecommendationAuthor | null {
  const name = firstNonEmptyString(row, 'author_display_name', 'author_name', 'user_name') ?? '';
  const handle = withHandlePrefix(
    firstNonEmptyString(row, 'author_handle', 'author_username', 'handle'),
  );
  const avatar =
    firstNonEmptyString(
      row,
      'author_profile_picture_url',
      'author_avatar_url',
      'author_avatar',
      'avatar_url',
      'avatar',
      'profile_picture_url',
    ) ?? '';

  if (!name && !handle && !avatar) return null;
  return { name, handle, avatar };
}

function mapCategory(row: Record<string, unknown>): { categoryId: string; category: string } {
  const categoryCode = firstNonEmptyString(row, 'category_code', 'category_id') ?? '';
  const category =
    firstNonEmptyString(row, 'category_name', 'category_display_name', 'category') ??
    (categoryCode ? categoryCode.replace(/_/g, ' ') : '');
  return {
    categoryId: categoryCode || 'all',
    category,
  };
}

function mapMedia(row: Record<string, unknown>) {
  const photoPaths = coerceStringList(row.photo_paths ?? row.photoPaths);
  const photoPath =
    firstNonEmptyString(row, 'photo_path', 'photoPath') ?? (photoPaths[0] ? photoPaths[0] : null);
  const photoCount = firstFiniteNumber(row, photoPaths.length, 'photo_count', 'photoCount');
  const imageField = firstNonEmptyString(row, 'image', 'photo_url');
  const image = imageField && isHttpUrl(imageField) ? imageField : null;

  return {
    image,
    photoPath,
    photoPaths: photoPaths.length > 0 ? photoPaths : undefined,
    photoCount,
    placeholderColors: nonEmptyStringList(row.placeholder_colors ?? row.placeholderColors),
  };
}

export function recommendationStub(rexId: string): Recommendation {
  return {
    id: rexId,
    title: '',
    categoryId: 'all',
    category: '',
    createdAt: null,
    likes: 0,
    comments: 0,
    saves: 0,
    isLiked: false,
    isSaved: false,
  };
}

export function mapApiRowToRecommendation(row: unknown): Recommendation | null {
  if (!isPlainObject(row)) return null;

  const id = firstNonEmptyString(row, 'id', 'rex_id', 'rexId');
  if (!id) return null;

  const { categoryId, category } = mapCategory(row);
  const media = mapMedia(row);
  const authorId = firstNonEmptyString(row, 'user_id', 'author_id', 'author_user_id') ?? undefined;

  const description =
    firstNonEmptyString(row, 'review', 'description') ??
    firstNonEmptyString(row, 'must_know', 'quick_tip');

  return {
    id,
    authorId,
    authorRelationshipStatus: parseRelationshipStatus(row.author_relationship_status),
    title: firstNonEmptyString(row, 'place_name', 'title') ?? '',
    description,
    ...media,
    categoryId,
    category,
    categoryIcon: firstNonEmptyString(row, 'category_icon'),
    location: firstNonEmptyString(row, 'place_location') ?? undefined,
    locationText: firstNonEmptyString(row, 'location_text', 'locationText') ?? null,
    placeWebsiteUrl: firstNonEmptyString(row, 'place_website_url', 'placeWebsiteUrl') ?? null,
    isOnlinePlace: optionalBoolean(row, 'is_online_place', 'isOnlinePlace'),
    latitude: optionalFiniteNumber(row, 'latitude'),
    longitude: optionalFiniteNumber(row, 'longitude'),
    rating:
      firstPositiveFiniteNumber(row, 'overall_rating', 'overallRating', 'rating', 'avg_rating') ??
      null,
    scoreValueForMoney: firstFiniteNumberInInclusiveRange(
      row,
      1,
      5,
      'score_value_for_money',
      'scoreValueForMoney',
    ),
    tags: nonEmptyStringList(row.tag_names ?? row.tag_slugs ?? row.tags),
    savedAt: firstNonEmptyString(row, 'saved_at') ?? null,
    createdAt: firstNonEmptyString(row, 'created_at', 'createdAt'),
    user: mapAuthor(row),
    likes: firstFiniteNumber(row, 0, 'like_count', 'likes'),
    comments: firstFiniteNumber(row, 0, 'comment_count', 'comments'),
    saves: firstFiniteNumber(row, 0, 'save_count', 'saves'),
    isLiked: firstBoolean(row, 'liked_by_me', 'is_liked'),
    isSaved: firstBoolean(row, 'saved_by_me', 'is_saved'),
  };
}
