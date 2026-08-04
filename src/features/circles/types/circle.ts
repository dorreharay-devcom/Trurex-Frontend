export type CircleApiRow = {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  system_kind: string | null;
  invitation_code?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  color?: string | null;
  member_count?: number;
  sort_rank?: number;
};

export type CreateCircleParams = {
  input_name: string;
  input_description?: string | null;
  input_icon_url?: string | null;
  input_color?: string | null;
};

export type UpdateCircleParams = {
  input_circle_id: string;
  input_name?: string;
  input_description?: string | null;
  input_icon_url?: string | null;
  input_color?: string | null;
};

export type CircleMemberProfile = {
  user_id: string;
  display_name: string | null;
  handle: string | null;
  avatar_url: string | null;
};
