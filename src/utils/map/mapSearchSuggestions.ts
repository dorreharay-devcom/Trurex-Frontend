import type { Recommendation } from '~/types/recommendation/recommendation';

export const MAP_SEARCH_SUGGEST_MIN_QUERY_LENGTH = 2;
export const MAP_SEARCH_SUGGEST_LIMIT = 5;

function normalizedQuery(raw: string): string {
  return raw.trim().toLowerCase();
}

export function mapSearchTitleSuggestions(
  recommendations: readonly Recommendation[],
  rawQuery: string,
): Recommendation[] {
  const q = normalizedQuery(rawQuery);
  if (q.length < MAP_SEARCH_SUGGEST_MIN_QUERY_LENGTH) return [];

  const matches = recommendations.filter((r) => r.title.toLowerCase().includes(q));
  const byId = new Map<string, Recommendation>();
  for (const r of matches) {
    if (byId.has(r.id)) continue;
    byId.set(r.id, r);
    if (byId.size >= MAP_SEARCH_SUGGEST_LIMIT) break;
  }
  return [...byId.values()];
}
