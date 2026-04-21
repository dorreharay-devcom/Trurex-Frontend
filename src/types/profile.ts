export type RelationshipStatus = 'follows_you' | 'following' | 'trusted' | null;

export interface ProfileData {
  userId: string;
  displayName: string;
  handle: string;
  bio?: string;
  location?: string;
  avatarUrl: string | null;
  trustScore: number;
  rexCount: number;
  followers: number;
  following: number;
  relationshipStatus: RelationshipStatus;
  currently?: {
    binging?: string;
    listening?: string;
    reading?: string;
  };
}

export interface UserProfileResponse {
  user_id: string;
  display_name: string;
  handle: string | null;
  avatar_url: string | null;
  location: string | null;
  bio: string | null;
  currently_binging: string | null;
  currently_listening_to: string | null;
  currently_reading: string | null;
  trust_score: number;
  relationship_status: RelationshipStatus;
}

export interface UserFollowResponse extends UserProfileResponse {
  followed_at: string;
}

export interface Category {
  id: string;
  code: string;
  display_name: string;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
