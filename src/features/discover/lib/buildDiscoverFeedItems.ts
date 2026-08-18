import type { Recommendation } from '~/shared/types/recommendation';

export const PEOPLE_SUGGESTIONS_AFTER_REX_COUNT = 10;

export type DiscoverRexFeedItem = {
  type: 'rex';
  id: string;
  recommendation: Recommendation;
};

export type DiscoverPeopleSuggestionsFeedItem = {
  type: 'people_suggestions';
  id: 'people_suggestions';
};

export type DiscoverFeedItem = DiscoverRexFeedItem | DiscoverPeopleSuggestionsFeedItem;

export function buildDiscoverFeedItems(
  rows: Recommendation[],
  options?: { includePeopleSuggestions?: boolean; afterCount?: number },
): DiscoverFeedItem[] {
  const afterCount = options?.afterCount ?? PEOPLE_SUGGESTIONS_AFTER_REX_COUNT;
  const includePeopleSuggestions = options?.includePeopleSuggestions ?? false;
  const items: DiscoverFeedItem[] = [];

  for (let index = 0; index < rows.length; index += 1) {
    const recommendation = rows[index];
    items.push({
      type: 'rex',
      id: recommendation.id,
      recommendation,
    });
    if (includePeopleSuggestions && index + 1 === afterCount) {
      items.push({ type: 'people_suggestions', id: 'people_suggestions' });
    }
  }

  return items;
}
