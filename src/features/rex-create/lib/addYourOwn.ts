import type { CreateRecSearchPlace } from '~/types/recommendation/create';
import type { Recommendation } from '~/types/recommendation/recommendation';
import type { RexDetailRow } from '~/types/recommendation/rexDetail';

export type AddYourOwnRecSource = {
  placeName: string;
  categoryCode: string | null;
  linkedPlaceId: string | null;
  isOnlinePlace: boolean;
  placeWebsiteUrl: string | null;
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
  const isOnlinePlace = Boolean(detail?.is_online_place ?? rec.isOnlinePlace);
  const placeWebsiteUrl = (detail?.place_website_url ?? rec.placeWebsiteUrl ?? '').trim() || null;
  return {
    placeName,
    categoryCode: normalizeCategoryCode(detail?.category_code, rec.categoryId),
    linkedPlaceId:
      !isOnlinePlace && detail?.place_id && detail.place_id.trim() ? detail.place_id.trim() : null,
    isOnlinePlace,
    placeWebsiteUrl,
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
