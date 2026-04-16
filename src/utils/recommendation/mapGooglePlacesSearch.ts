import type { GooglePlacesSearchResultItem } from '~/api/rexPlacesApi';
import type { CreateRecSearchPlace } from '~/types/recommendation/create';

export function mapSearchItemToCreateRecPlace(
  r: GooglePlacesSearchResultItem,
): CreateRecSearchPlace | null {
  if (r.source === 'database') {
    if (!r.id) return null;
    return {
      id: r.id,
      source: 'database',
      title: r.mainText,
      subtitle: r.secondaryText ?? r.fullText ?? '',
      categoryLabel: 'Saved',
      categoryId: null,
      provider: r.provider,
      providerPlaceId: r.providerPlaceId,
      placeResourceName: r.placeResourceName,
      fullText: r.fullText,
      latitude: r.latitude ?? null,
      longitude: r.longitude ?? null,
    };
  }
  const pid = r.providerPlaceId;
  if (!pid) return null;
  return {
    id: `google:${pid}`,
    source: 'google',
    title: r.mainText,
    subtitle: r.secondaryText ?? '',
    categoryLabel: 'Google',
    categoryId: null,
    provider: r.provider,
    providerPlaceId: r.providerPlaceId,
    placeResourceName: r.placeResourceName,
    fullText: r.fullText,
    latitude: r.latitude ?? null,
    longitude: r.longitude ?? null,
  };
}

export function mapSearchResponseToPlaces(
  results: GooglePlacesSearchResultItem[],
): CreateRecSearchPlace[] {
  return results.flatMap((row) => {
    const p = mapSearchItemToCreateRecPlace(row);
    return p ? [p] : [];
  });
}
