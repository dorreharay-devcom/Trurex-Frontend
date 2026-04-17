import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { Recommendation } from '~/types/recommendation/recommendation';
import { averageScoreFromCategoryRatings } from '~/utils/recommendation/rexFeedDisplay';

dayjs.extend(relativeTime);

function optStr(o: Record<string, unknown>, ...keys: string[]): string | null {
  for (const k of keys) {
    const v = o[k];
    if (v == null) continue;
    const s = String(v).trim();
    if (s) return s;
  }
  return null;
}

function num(o: Record<string, unknown>, def: number, ...keys: string[]): number {
  for (const k of keys) {
    const v = o[k];
    if (typeof v === 'number' && !Number.isNaN(v)) return v;
    if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) return Number(v);
  }
  return def;
}

function optionalPositiveRating(o: Record<string, unknown>): number | undefined {
  for (const k of ['rating', 'avg_rating']) {
    const v = o[k];
    if (typeof v === 'number' && !Number.isNaN(v) && v > 0) return v;
    if (typeof v === 'string' && v.trim() !== '') {
      const n = Number(v);
      if (!Number.isNaN(n) && n > 0) return n;
    }
  }
  return undefined;
}

function optionalScoreValueForMoney(o: Record<string, unknown>): number | null {
  const v = o.score_value_for_money ?? o.scoreValueForMoney;
  if (typeof v === 'number' && v >= 1 && v <= 5 && !Number.isNaN(v)) return v;
  return null;
}

function pickBool(o: Record<string, unknown>, ...keys: string[]): boolean {
  for (const k of keys) {
    const v = o[k];
    if (typeof v === 'boolean') return v;
  }
  return false;
}

function parseTags(o: Record<string, unknown>): string[] | null {
  const raw = o.tag_slugs ?? o.tags;
  if (Array.isArray(raw)) return raw.map(String).filter(Boolean);
  return null;
}

function normalizeHandle(raw: string): string {
  if (!raw) return '';
  const t = raw.trim();
  if (!t) return '';
  return t.startsWith('@') ? t : `@${t}`;
}

export function mapDiscoverFeedRowSafe(row: unknown): Recommendation | null {
  try {
    return mapDiscoverFeedRow(row);
  } catch {
    return null;
  }
}

export function mapDiscoverFeedRow(row: unknown): Recommendation {
  const o = row as Record<string, unknown>;
  const id = optStr(o, 'id', 'rex_id', 'rexId');
  if (!id) {
    throw new Error('discover_feed row missing id');
  }

  const photoPath =
    optStr(o, 'photo_path', 'photoPath') ??
    (Array.isArray(o.photo_paths) && o.photo_paths.length > 0
      ? String((o.photo_paths as unknown[])[0])
      : Array.isArray(o.photoPaths) && o.photoPaths.length > 0
        ? String((o.photoPaths as unknown[])[0])
        : null);

  const imageField = optStr(o, 'image', 'photo_url');
  const image = imageField && /^https?:\/\//i.test(imageField) ? imageField : null;

  const authorId = optStr(o, 'user_id', 'author_id', 'author_user_id') ?? undefined;
  const authorName = optStr(o, 'author_display_name', 'author_name', 'user_name') ?? 'Member';
  const authorHandle = normalizeHandle(optStr(o, 'author_handle', 'handle') ?? '');
  const avatarRaw = optStr(o, 'author_avatar_url', 'author_avatar', 'avatar_url', 'avatar');

  const created = o.created_at ?? o.createdAt;

  const categoryCode = optStr(o, 'category_code', 'category_id') ?? '';
  const categoryLabel =
    (
      optStr(o, 'category_name', 'category_display_name', 'category') ??
      (categoryCode ? categoryCode.replace(/_/g, ' ') : '')
    ).trim() || 'Uncategorized';

  const explicitRating = optionalPositiveRating(o);
  const fromDimensions = averageScoreFromCategoryRatings(o.category_ratings);
  const rating =
    explicitRating != null
      ? explicitRating
      : fromDimensions != null && fromDimensions > 0
        ? fromDimensions
        : null;

  const bodyText = optStr(o, 'review', 'description') ?? optStr(o, 'quick_tip') ?? null;

  return {
    id,
    authorId,
    title: optStr(o, 'place_name', 'title') ?? 'Place',
    description: bodyText,
    image,
    photoPath,
    categoryId: categoryCode || 'all',
    category: categoryLabel,
    location: optStr(o, 'location', 'place_address') ?? undefined,
    latitude: typeof o.latitude === 'number' ? o.latitude : undefined,
    longitude: typeof o.longitude === 'number' ? o.longitude : undefined,
    rating,
    scoreValueForMoney: optionalScoreValueForMoney(o),
    tags: parseTags(o),
    user: {
      name: authorName,
      handle: authorHandle,
      avatar: avatarRaw ?? '',
    },
    timeAgo:
      created != null && dayjs(String(created)).isValid() ? dayjs(String(created)).fromNow() : '',
    likes: num(o, 0, 'like_count', 'likes'),
    comments: num(o, 0, 'comment_count', 'comments'),
    saves: num(o, 0, 'save_count', 'saves'),
    isLiked: pickBool(o, 'liked_by_me', 'is_liked'),
    isSaved: pickBool(o, 'saved_by_me', 'is_saved'),
  };
}
