import type { RelationshipStatus as KnownRelationshipStatus } from '~/shared/config/relationshipStatus';

export type RelationshipStatus = KnownRelationshipStatus | null;

export type CurrentlyData = {
  binging?: string;
  listening?: string;
  reading?: string;
};

export type PendingAvatar = {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
  dispose?: () => void;
};

export type ProfileData = {
  userId: string;
  displayName: string;
  handle: string;
  bio?: string;
  location?: string;
  avatarUrl: string | null;
  trustScore: number;
  rexScore: number;
  rexTier: string | null;
  rexCount: number;
  followers: number;
  following: number;
  relationshipStatus: RelationshipStatus;
  currently?: CurrentlyData;
};

export type ProfileUserRow = {
  id: string;
  email?: string;
  display_name: string;
  handle: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  currently_binging: string | null;
  currently_listening_to: string | null;
  currently_reading: string | null;
  trust_score: number;
  rex_score: number;
  rex_tier: string | null;
  followers_count: number;
  following_count: number;
  rexes_created_count: number;
  relationship_status: RelationshipStatus | string | null;
  user_id?: string;
};

export type UpdateProfileInput = {
  display_name?: string | null;
  handle?: string | null;
  bio?: string | null;
  location?: string | null;
  avatar_url?: string | null;
  currently_binging?: string | null;
  currently_listening_to?: string | null;
  currently_reading?: string | null;
};
