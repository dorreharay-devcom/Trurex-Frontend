import type { Recommendation } from '~/types/recommendation/recommendation';
import type { MapMarkerItem } from '~/types/map/mapMarker';

export function filterLocatedRecommendations(recs: Recommendation[]): Recommendation[] {
  return recs.filter((r) => r.location);
}

export function filterRecommendationsBySearchQuery(
  recs: Recommendation[],
  rawQuery: string,
): Recommendation[] {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return recs;
  return recs.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.location?.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.tags.some((t) => t.toLowerCase().includes(q)) ||
      r.description.toLowerCase().includes(q),
  );
}

export function filterRecommendationsByCategoryId(
  recs: Recommendation[],
  categoryId: string,
): Recommendation[] {
  if (categoryId === 'all') return recs;
  return recs.filter((r) => r.categoryId === categoryId);
}

export function recommendationToMapMarker(
  r: Recommendation & { latitude: number; longitude: number },
): MapMarkerItem {
  return {
    id: r.id,
    latitude: r.latitude,
    longitude: r.longitude,
    title: r.title,
    subtitle: r.location,
    imageUrl: r.image,
  };
}

export function recommendationsToMapMarkers(recs: Recommendation[]): MapMarkerItem[] {
  return recs
    .filter(
      (r): r is Recommendation & { latitude: number; longitude: number } =>
        r.latitude != null && r.longitude != null,
    )
    .map(recommendationToMapMarker);
}
