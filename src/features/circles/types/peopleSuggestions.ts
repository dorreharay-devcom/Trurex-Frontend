import type { RelationshipStatus } from '~/shared/config/relationshipStatus';

export type PeopleSuggestionRelationshipStatus = RelationshipStatus;

export type PeopleSuggestionPrimaryReason = 'second_degree' | 'third_degree' | 'fallback_global';

export type CommonCircle = {
  id: string;
  name: string;
  owner_id: string;
  owner_display_name: string;
  system_kind: string | null;
};

export type PeopleSuggestionRow = {
  candidate_user_id: string;
  display_name: string;
  handle: string | null;
  avatar_url: string | null;
  trust_score: number;
  followers_count: number;
  following_count: number;
  rexes_created_count: number;
  relationship_status: PeopleSuggestionRelationshipStatus | null;
  primary_reason: PeopleSuggestionPrimaryReason;
  connection_degree: number | null;
  mutual_count: number;
  common_circle_count: number;
  common_circles: CommonCircle[];
  rank: number;
};
