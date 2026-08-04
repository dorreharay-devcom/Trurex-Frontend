import type { RelationshipStatus } from '~/shared/config/relationshipStatus';

export type NetworkUserRow = {
  user_id: string;
  display_name: string;
  handle: string | null;
  avatar_url: string | null;
  trust_score: number;
  followers_count?: number;
  following_count?: number;
  rexes_created_count?: number;
  relationship_status: RelationshipStatus | null;
  followed_at?: string;
  bio: string | null;
};

export type SearchUsersScope = 'all_users' | 'following' | 'followers' | 'trusted' | 'user_network';
