import { RELATIONSHIP_STATUS } from '~/shared/config/relationshipStatus';
import type {
  PeopleSuggestionPrimaryReason,
  PeopleSuggestionRelationshipStatus,
} from '~/features/circles/types/peopleSuggestions';

export const SUGGESTION_REASON = {
  secondDegree: 'second_degree',
  thirdDegree: 'third_degree',
  fallbackGlobal: 'fallback_global',
} as const satisfies Record<string, PeopleSuggestionPrimaryReason>;

export const SUGGESTION_RELATIONSHIP = RELATIONSHIP_STATUS satisfies Record<
  string,
  PeopleSuggestionRelationshipStatus
>;
