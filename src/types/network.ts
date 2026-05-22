export interface NetworkUserRow {
  user_id: string;
  display_name: string;
  handle: string | null;
  avatar_url: string | null;
  trust_score: number;
  followers_count?: number;
  following_count?: number;
  rexes_created_count?: number;
  relationship_status: 'follows_you' | 'following' | 'trusted' | null;
  followed_at?: string;
  bio: string | null;
}

export interface UserProfileRow {
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
  followers_count: number;
  following_count: number;
  rexes_created_count: number;
  relationship_status: 'follows_you' | 'following' | 'trusted' | null;
}

export interface PublicUserRow {
  id: string;
  display_name: string;
  handle: string | null;
  avatar_url: string | null;
  location: string | null;
  bio: string | null;
  currently_binging: string | null;
  currently_listening_to: string | null;
  currently_reading: string | null;
}

export interface ProfileResult {
  user_id: string;
  display_name: string | null;
  handle: string | null;
  avatar_url: string | null;
  location: string | null;
  bio?: string | null;
  is_private: boolean;
}

export interface SuggestedUser extends ProfileResult {
  degree: 2 | 3;
  mutualCount: number;
  mutualProfiles: ProfileResult[];
}

export interface FollowRequest {
  requestId: string;
  profile: ProfileResult;
}

export type UserConfigRow = {
  avatar_url: string | null;
  pinned_category_ids: string[];
  status?: 'active' | 'frozen' | string | null;
};
