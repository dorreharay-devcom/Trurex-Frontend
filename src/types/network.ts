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
