import { CREATE_REC_SEARCH_PLACES } from '~/constants/recommendation/mockSearchPlaces';
import type { CreateRecSearchPlace } from '~/types/recommendation/create';

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
