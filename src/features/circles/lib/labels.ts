import { SUGGESTION_REASON } from '~/features/circles/config/peopleSuggestions';
import type { PeopleSuggestionRow } from '~/features/circles/types/peopleSuggestions';

export function connectionCountLabel(count: number, hasNextPage: boolean): string {
  return hasNextPage ? `${count}+` : String(count);
}

export function memberCountLabel(count: number): string {
  return count === 1 ? '1 member' : `${count} members`;
}

export function ordinalDegreeLabel(degree: number): string {
  const j = degree % 10;
  const k = degree % 100;
  if (j === 1 && k !== 11) return `${degree}st`;
  if (j === 2 && k !== 12) return `${degree}nd`;
  if (j === 3 && k !== 13) return `${degree}rd`;
  return `${degree}th`;
}

export function suggestionSubtitle(suggestion: PeopleSuggestionRow): string | undefined {
  if (suggestion.primary_reason === SUGGESTION_REASON.fallbackGlobal) return 'Suggested for you';
  return undefined;
}
