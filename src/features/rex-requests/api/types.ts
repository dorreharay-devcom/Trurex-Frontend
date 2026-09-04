import type { NeedBy } from '~/features/rex-requests/config/needBy';

export type CategoryItem = {
  id: string;
  code: string;
  name: string;
  icon: string;
  color: string;
};

export type RexRequestRow = {
  id: string;
  requester_id: string;
  // Absent on rows returned by my_rex_requests (your own history) — you already know it's you.
  requester_display_name?: string;
  requester_handle?: string;
  requester_avatar_url?: string | null;
  categories: CategoryItem[];
  looking_for_text: string;
  location_text: string | null;
  location_lat: number | null;
  location_lng: number | null;
  note: string | null;
  need_by: NeedBy;
  is_public: boolean;
  status: 'open' | 'resolved';
  created_at: string;
  response_count: number;
  comment_count: number;
  circle_names: string[];
};

export type CreateRexRequestParams = {
  categoryIds: string[];
  lookingForText: string;
  needBy: NeedBy;
  circleIds: string[];
  locationText?: string | null;
  locationLat?: number | null;
  locationLng?: number | null;
  note?: string | null;
  isPublic?: boolean;
};

export type GetRexRequestsFeedParams = {
  resultLimit: number;
  resultOffset: number;
  search?: string | null;
  circleFilter?: string[] | null;
  categoryIds?: string[] | null;
};

export type RexRequestResponseRow = {
  response_id: string;
  responder_id: string;
  responder_display_name: string;
  responder_handle: string;
  responder_avatar_url: string | null;
  responded_at: string;
  rex_id: string;
  rex_place_name: string;
  rex_description: string | null;
  rex_visibility: string;
  rex_category_code: string;
  rex_category_name: string;
  rex_photo_path: string | null;
  rex_overall_rating: number | null;
};

export type RexRequestCommentRow = {
  comment_id: string;
  commenter_id: string;
  commenter_display_name: string;
  commenter_handle: string;
  commenter_avatar_url: string | null;
  body: string;
  created_at: string;
};

export type EditRexRequestParams = {
  requestId: string;
  categoryIds?: string[];
  lookingForText?: string;
  needBy?: NeedBy;
  circleIds?: string[];
  locationText?: string | null;
  locationLat?: number | null;
  locationLng?: number | null;
  note?: string | null;
  isPublic?: boolean;
};
