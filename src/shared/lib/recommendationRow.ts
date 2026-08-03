import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { Recommendation } from '~/shared/types/recommendation';
import {
  firstBoolean,
  firstFiniteNumber,
  firstFiniteNumberInInclusiveRange,
  firstNonEmptyString,
  firstPositiveFiniteNumber,
  optionalFiniteNumber,
} from '~/utils/guards';

dayjs.extend(relativeTime);

function parseTags(o: Record<string, unknown>): string[] | null {
  const raw = o.tag_names ?? o.tag_slugs ?? o.tags;
  if (Array.isArray(raw)) return raw.map(String).filter(Boolean);
  return null;
}

function parseStringList(raw: unknown): string[] | null {
  if (!Array.isArray(raw)) return null;
  const values = raw.map((x) => String(x).trim()).filter(Boolean);
  return values.length > 0 ? values : null;
}

function normalizeHandle(raw: string): string {
  if (!raw) return '';
  const t = raw.trim();
  if (!t) return '';
  return t.startsWith('@') ? t : `@${t}`;
}

export function recommendationFromRowSafe(row: unknown): Recommendation | null {
  try {
    return recommendationFromRow(row);
  } catch {
    return null;
  }
}

export function recommendationFromRow(row: unknown): Recommendation {
  const o = row as Record<string, unknown>;
  const id = firstNonEmptyString(o, 'id', 'rex_id', 'rexId');
  if (!id) {
    throw new Error('feed row missing id');
  }

  const photoPathsRaw = o.photo_paths ?? o.photoPaths;
  const photoPaths: string[] = Array.isArray(photoPathsRaw)
    ? (photoPathsRaw as unknown[]).map((x) => String(x).trim()).filter(Boolean)
    : [];

  const photoPath =
    firstNonEmptyString(o, 'photo_path', 'photoPath') ?? (photoPaths[0] ? photoPaths[0] : null);

  const photoCountRaw = o.photo_count;
  const photoCount =
    typeof photoCountRaw === 'number' && Number.isFinite(photoCountRaw)
      ? photoCountRaw
      : photoPaths.length;

  const imageField = firstNonEmptyString(o, 'image', 'photo_url');
  const image = imageField && /^https?:\/\//i.test(imageField) ? imageField : null;

  const authorId = firstNonEmptyString(o, 'user_id', 'author_id', 'author_user_id') ?? undefined;
  const relationshipRaw = o.author_relationship_status;
  const authorRelationshipStatus =
    relationshipRaw === 'follows_you' ||
    relationshipRaw === 'following' ||
    relationshipRaw === 'trusted'
      ? relationshipRaw
      : null;
  const authorName =
    firstNonEmptyString(o, 'author_display_name', 'author_name', 'user_name') ?? 'Member';
  const authorHandle = normalizeHandle(
    firstNonEmptyString(o, 'author_handle', 'author_username', 'handle') ?? '',
  );
  const avatarRaw = firstNonEmptyString(
    o,
    'author_profile_picture_url',
    'author_avatar_url',
    'author_avatar',
    'avatar_url',
    'avatar',
    'profile_picture_url',
  );

  const created = o.created_at ?? o.createdAt;

  const categoryCode = firstNonEmptyString(o, 'category_code', 'category_id') ?? '';
  const categoryIcon = firstNonEmptyString(o, 'category_icon');
  const categoryLabel =
    (
      firstNonEmptyString(o, 'category_name', 'category_display_name', 'category') ??
      (categoryCode ? categoryCode.replace(/_/g, ' ') : '')
    ).trim() || 'Uncategorized';

  const rating =
    firstPositiveFiniteNumber(o, 'overall_rating', 'overallRating', 'rating', 'avg_rating') ?? null;

  const bodyText =
    firstNonEmptyString(o, 'review', 'description') ??
    firstNonEmptyString(o, 'must_know', 'quick_tip');

  return {
    id,
    authorId,
    authorRelationshipStatus,
    title: firstNonEmptyString(o, 'place_name', 'title') ?? 'Place',
    description: bodyText,
    image,
    photoPath,
    photoPaths: photoPaths.length > 0 ? photoPaths : undefined,
    photoCount,
    placeholderColors: parseStringList(o.placeholder_colors ?? o.placeholderColors),
    categoryId: categoryCode || 'all',
    category: categoryLabel,
    categoryIcon,
    location: firstNonEmptyString(o, 'place_location') ?? undefined,
    locationText: firstNonEmptyString(o, 'location_text', 'locationText') ?? null,
    placeWebsiteUrl: firstNonEmptyString(o, 'place_website_url', 'placeWebsiteUrl') ?? null,
    isOnlinePlace: firstBoolean(o, 'is_online_place', 'isOnlinePlace'),
    latitude: optionalFiniteNumber(o, 'latitude'),
    longitude: optionalFiniteNumber(o, 'longitude'),
    rating,
    scoreValueForMoney: firstFiniteNumberInInclusiveRange(
      o,
      1,
      5,
      'score_value_for_money',
      'scoreValueForMoney',
    ),
    tags: parseTags(o),
    savedAt: firstNonEmptyString(o, 'saved_at') ?? null,
    user: {
      name: authorName,
      handle: authorHandle,
      avatar: avatarRaw ?? '',
    },
    timeAgo:
      created != null && dayjs(String(created)).isValid() ? dayjs(String(created)).fromNow() : '',
    likes: firstFiniteNumber(o, 0, 'like_count', 'likes'),
    comments: firstFiniteNumber(o, 0, 'comment_count', 'comments'),
    saves: firstFiniteNumber(o, 0, 'save_count', 'saves'),
    isLiked: firstBoolean(o, 'liked_by_me', 'is_liked'),
    isSaved: firstBoolean(o, 'saved_by_me', 'is_saved'),
  };
}
