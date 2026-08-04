import type { Recommendation } from '~/shared/types/recommendation';

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
