import { CREATE_REC_SEARCH_PLACES } from '~/constants/recommendation/mockSearchPlaces';
import type { User } from '@supabase/supabase-js';
import type {
  CategoryCreateConfig,
  CategoryQuestion,
  CategoryRatingDimension,
  CategorySubcategoryConfig,
  CategoryTagOption,
  CreateRexRpcParams,
} from '~/types/recommendation/rexCategoryCreateConfig';
import type { CreateRecSearchPlace, SearchEntryMode } from '~/types/recommendation/create';
import type { Recommendation } from '~/types/recommendation/recommendation';
import type { RexDetailRow } from '~/types/recommendation/rexDetail';
import type { UserProfileRow } from '~/types/network';
import { isStrictUuid } from '~/utils/guards';

export function resolveSubcategoryForMerge(
  config: CategoryCreateConfig,
  subcategoryCode: string | null,
): CategorySubcategoryConfig | null {
  if (subcategoryCode) {
    return config.subcategories.find((s) => s.code === subcategoryCode) ?? null;
  }
  if (config.subcategories.length === 0) return null;
  const sorted = [...config.subcategories].sort((a, b) => {
    const d = a.sort_order - b.sort_order;
    if (d !== 0) return d;
    return a.code.localeCompare(b.code);
  });
  return sorted[0] ?? null;
}

function sortByOrder<T extends { sort_order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const d = a.sort_order - b.sort_order;
    if (d !== 0) return d;
    return String(
      (a as { code?: string }).code ?? (a as { slug?: string }).slug ?? '',
    ).localeCompare(String((b as { code?: string }).code ?? (b as { slug?: string }).slug ?? ''));
  });
}

function mergeKeyed<T extends { code: string; sort_order: number }>(
  categoryLevel: T[],
  subLevel: T[],
): T[] {
  const map = new Map<string, T>();
  for (const x of sortByOrder(categoryLevel)) {
    map.set(x.code, x);
  }
  for (const x of sortByOrder(subLevel)) {
    map.set(x.code, x);
  }
  return sortByOrder([...map.values()]);
}

export function mergeRatingDimensions(
  config: CategoryCreateConfig,
  subcategoryCode: string | null,
): CategoryRatingDimension[] {
  const sub = resolveSubcategoryForMerge(config, subcategoryCode);
  return mergeKeyed(config.rating_dimensions, sub?.rating_dimensions ?? []);
}

export function mergeQuestions(
  config: CategoryCreateConfig,
  subcategoryCode: string | null,
): CategoryQuestion[] {
  const sub = resolveSubcategoryForMerge(config, subcategoryCode);
  return mergeKeyed(config.questions, sub?.questions ?? []);
}

export function mergeTagOptions(
  config: CategoryCreateConfig,
  subcategoryCode: string | null,
): CategoryTagOption[] {
  const sub = resolveSubcategoryForMerge(config, subcategoryCode);
  const combined = [...config.tag_options, ...(sub?.tag_options ?? [])];
  const seen = new Set<string>();
  const out: CategoryTagOption[] = [];
  for (const t of sortByOrder(combined)) {
    if (seen.has(t.slug)) continue;
    seen.add(t.slug);
    out.push(t);
  }
  return out;
}

export type TagOptionsGroup = {
  groupTitle: string;
  tags: CategoryTagOption[];
};

export function groupTagOptionsByTagGroup(tags: CategoryTagOption[]): TagOptionsGroup[] {
  const map = new Map<string, CategoryTagOption[]>();
  for (const t of tags) {
    const raw = t.tag_group;
    const g = typeof raw === 'string' && raw.trim() !== '' ? raw.trim() : '';
    if (!map.has(g)) map.set(g, []);
    map.get(g)!.push(t);
  }
  const buckets = [...map.entries()].map(([groupTitle, list]) => ({
    groupTitle,
    tags: sortByOrder(list),
  }));
  buckets.sort((a, b) => {
    const aEmpty = a.groupTitle === '';
    const bEmpty = b.groupTitle === '';
    if (aEmpty !== bEmpty) return aEmpty ? 1 : -1;
    const aMin = Math.min(...a.tags.map((x) => x.sort_order));
    const bMin = Math.min(...b.tags.map((x) => x.sort_order));
    if (aMin !== bMin) return aMin - bMin;
    if (aEmpty) return 0;
    return a.groupTitle.localeCompare(b.groupTitle);
  });
  return buckets;
}

export function categoryRatingDimensionsOnly(
  config: CategoryCreateConfig,
): CategoryRatingDimension[] {
  return sortByOrder(config.rating_dimensions);
}

export function subcategoryRatingDimensionsOnly(
  config: CategoryCreateConfig,
  subcategoryCode: string | null,
): CategoryRatingDimension[] {
  if (!subcategoryCode) return [];
  const sub = config.subcategories.find((s) => s.code === subcategoryCode) ?? null;
  return sub ? sortByOrder(sub.rating_dimensions) : [];
}

export function categoryQuestionsOnly(config: CategoryCreateConfig): CategoryQuestion[] {
  return sortByOrder(config.questions);
}

export function subcategoryQuestionsOnly(
  config: CategoryCreateConfig,
  subcategoryCode: string | null,
): CategoryQuestion[] {
  if (!subcategoryCode) return [];
  const sub = config.subcategories.find((s) => s.code === subcategoryCode) ?? null;
  return sub ? sortByOrder(sub.questions) : [];
}

export function resolveVisibilityAndCircles(
  selectedCircleIds: Set<string>,
): Pick<CreateRexRpcParams, 'p_visibility' | 'circle_ids'> {
  const ids = [...selectedCircleIds].filter((id) => id !== 'public');
  const uuids = ids.filter(isStrictUuid);
  if (uuids.length > 0) {
    return { p_visibility: 'circles', circle_ids: uuids };
  }
  return { p_visibility: 'public', circle_ids: null };
}

export function getPlaceNameForRex(
  searchMode: SearchEntryMode,
  selectedSearchPlace: CreateRecSearchPlace | null,
  manualName: string,
): string {
  if (searchMode === 'manual') {
    return manualName.trim() || 'Place';
  }
  return selectedSearchPlace?.title.trim() || 'Place';
}

export function getLinkedPlaceId(linkedPlaceId: string | null): string | undefined {
  if (!linkedPlaceId || !isStrictUuid(linkedPlaceId)) return undefined;
  return linkedPlaceId;
}

export function buildCategoryRatingsPayload(
  scores: Record<string, number | null>,
): Record<string, number> {
  return Object.fromEntries(
    Object.entries(scores).filter(([, v]) => v != null) as [string, number][],
  );
}

export function hasNonPublicMockCircleSelection(selectedCircleIds: Set<string>): boolean {
  return [...selectedCircleIds].some((id) => id !== 'public' && !isStrictUuid(id));
}

export type AddYourOwnRecSource = {
  placeName: string;
  categoryCode: string | null;
  linkedPlaceId: string | null;
  placeCategoryLabel: string;
  locationLine: string | null;
  latitude: number | null;
  longitude: number | null;
};

const INVALID_LIST_CATEGORY = new Set(['all', '']);

function normalizeCategoryCode(
  fromDetail: string | null | undefined,
  fromRec: string | null | undefined,
): string | null {
  const tryOne = (s: string | null | undefined) => {
    const t = s?.trim();
    if (!t || INVALID_LIST_CATEGORY.has(t)) return null;
    return t;
  };
  return tryOne(fromDetail) ?? tryOne(fromRec) ?? null;
}

function resolvePlaceName(detail: RexDetailRow | null | undefined, rec: Recommendation): string {
  return detail?.place_name?.trim() || rec.title?.trim() || 'Place';
}

export function buildAddYourOwnRecSource(
  rec: Recommendation,
  detail: RexDetailRow | null | undefined,
): AddYourOwnRecSource {
  const placeName = resolvePlaceName(detail, rec);
  const placeCategoryLabel = detail?.category_name?.trim() || rec.category?.trim() || 'Place';
  return {
    placeName,
    categoryCode: normalizeCategoryCode(detail?.category_code, rec.categoryId),
    linkedPlaceId: detail?.place_id && detail.place_id.trim() ? detail.place_id.trim() : null,
    placeCategoryLabel,
    locationLine: rec.location ? rec.location.trim() : null,
    latitude: rec.latitude != null && !Number.isNaN(rec.latitude) ? rec.latitude : null,
    longitude: rec.longitude != null && !Number.isNaN(rec.longitude) ? rec.longitude : null,
  };
}

export function buildSelectedSearchPlaceFromAddYourOwn(
  s: AddYourOwnRecSource,
): CreateRecSearchPlace | null {
  if (!s.linkedPlaceId) return null;
  return {
    id: s.linkedPlaceId,
    source: 'database',
    title: s.placeName,
    subtitle: s.locationLine ?? '',
    categoryLabel: s.placeCategoryLabel,
    categoryId: s.categoryCode,
    categoryCode: s.categoryCode,
    fullText: s.locationLine ? `${s.placeName} — ${s.locationLine}` : s.placeName,
    latitude: s.latitude,
    longitude: s.longitude,
  };
}

export function countFilledStarRatings(ratings: number[]): number {
  return ratings.filter((n) => n > 0).length;
}

export function countFilledCategoryRatings(scores: Record<string, number | null>): number {
  return Object.values(scores).filter((n) => n != null && n > 0).length;
}

export function countScorecardFilledSlots(
  scores: Record<string, number | null>,
  valueForMoney: number | null,
): number {
  return countFilledCategoryRatings(scores) + (valueForMoney != null && valueForMoney > 0 ? 1 : 0);
}

export type ConfirmAuthorPreview = {
  name: string;
  handle: string;
  initials: string;
};

function initialsFromDisplayName(displayName: string, email: string | undefined): string {
  const parts = displayName.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase();
  }
  const compact = displayName.replace(/\s/g, '');
  if (compact.length >= 2) return compact.slice(0, 2).toUpperCase();
  if (compact.length === 1)
    return `${compact[0]!.toUpperCase()}${email?.[1]?.toUpperCase() ?? ''}`.slice(0, 2);
  return email?.[0]?.toUpperCase() ?? '?';
}

export function authorFromAuthUser(user: User | null | undefined): ConfirmAuthorPreview {
  if (!user) {
    return { name: 'You', handle: '', initials: '?' };
  }
  const meta = user.user_metadata as Record<string, unknown> | undefined;
  const displayName =
    (typeof meta?.display_name === 'string' && meta.display_name.trim()) ||
    user.email?.split('@')[0] ||
    'You';
  const handleRaw =
    (typeof meta?.handle === 'string' && meta.handle.trim().replace(/^@/, '')) ||
    user.email?.split('@')[0] ||
    '';
  const handle = handleRaw ? `@${handleRaw}` : '';
  return {
    name: displayName,
    handle,
    initials: initialsFromDisplayName(displayName, user.email),
  };
}

export function authorForConfirmPreview(
  user: User | null | undefined,
  profile: UserProfileRow | null | undefined,
): ConfirmAuthorPreview {
  if (!profile) return authorFromAuthUser(user);
  const fallback = authorFromAuthUser(user);
  const name = profile.display_name?.trim() || fallback.name;
  const raw = profile.handle?.replace(/^@/, '').trim();
  const handle = raw ? `@${raw}` : fallback.handle;
  return {
    name,
    handle,
    initials: initialsFromDisplayName(name, user?.email),
  };
}

export function averageStarRating(ratings: number[]): string | null {
  const filled = ratings.filter((n) => n > 0);
  if (filled.length === 0) return null;
  const avg = filled.reduce((a, b) => a + b, 0) / filled.length;
  return (Math.round(avg * 10) / 10).toFixed(1);
}

export function averageCategoryRatings(
  scores: Record<string, number | null>,
  valueForMoney?: number | null,
): string | null {
  const filled = Object.values(scores).filter((n): n is number => n != null && n > 0);
  const nums = [...filled];
  if (valueForMoney != null && valueForMoney > 0) nums.push(valueForMoney);
  if (nums.length === 0) return null;
  const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
  return (Math.round(avg * 10) / 10).toFixed(1);
}

export type ConfirmPreviewPlace = {
  title: string;
  addressLines: string[];
};

export function getConfirmPreviewPlace(
  searchMode: SearchEntryMode,
  selectedSearchPlace: CreateRecSearchPlace | null,
  manualName: string,
  manualAddress: string,
  _manualGeotag: { lat: number; lng: number } | null,
): ConfirmPreviewPlace {
  if (searchMode === 'manual') {
    const addr = manualAddress.trim();
    return {
      title: manualName.trim() || '—',
      addressLines: addr ? [addr] : [],
    };
  }
  if (!selectedSearchPlace) return { title: '—', addressLines: [] };
  const sub = selectedSearchPlace.subtitle.trim();
  return { title: selectedSearchPlace.title, addressLines: sub ? [sub] : [] };
}

export function getConfirmTagLabels(
  selectedSlugs: string[],
  tagOptions: CategoryTagOption[],
): string[] {
  const map = new Map(tagOptions.map((t) => [t.slug, t.label]));
  return selectedSlugs.map((s) => map.get(s) ?? s);
}

export function getConfirmCircleTitles(
  selectedCircleIds: Set<string>,
  lookup: readonly { id: string; title: string }[],
): string[] {
  const map = new Map(lookup.map((c) => [c.id, c.title]));
  return [...selectedCircleIds].map((id) => map.get(id)).filter((t): t is string => Boolean(t));
}

export function filterCreateRecSearchPlaces(
  query: string,
  places: readonly CreateRecSearchPlace[] = CREATE_REC_SEARCH_PLACES,
): CreateRecSearchPlace[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return [...places];
  }
  return places.filter((p) => {
    return (
      p.title.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q)
    );
  });
}

export function getSearchStepSelectState(query: string) {
  const results = filterCreateRecSearchPlaces(query);
  const hasActiveQuery = query.trim().length > 0;
  const showNoResults = hasActiveQuery && results.length === 0;
  return { results, showNoResults };
}
