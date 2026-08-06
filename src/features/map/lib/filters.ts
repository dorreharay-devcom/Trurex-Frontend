import type { Recommendation } from '~/shared/types/recommendation';
import { isLatLngInBounds, type LatLngBounds } from '~/features/map/lib/geo';

export function filterLocatedRecommendations(recs: Recommendation[]): Recommendation[] {
  return recs.filter((r) => r.latitude != null && r.longitude != null);
}

export function filterRecommendationsByRexTitle(
  recs: Recommendation[],
  rawQuery: string,
): Recommendation[] {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return recs;
  return recs.filter((r) => r.title.toLowerCase().includes(q));
}

export function filterRecommendationsInBounds(
  recs: Recommendation[],
  bounds: LatLngBounds,
): Recommendation[] {
  return recs.filter((r) => {
    if (r.latitude == null || r.longitude == null) return false;
    return isLatLngInBounds(r.latitude, r.longitude, bounds);
  });
}
