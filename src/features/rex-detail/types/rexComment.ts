export type RexCommentRpc = {
  id: string;
  rex_id: string;
  parent_comment_id: string | null;
  author_id: string;
  author_display_name: string;
  author_username: string | null;
  author_profile_picture_url: string | null;
  author_relationship_status: string | null;
  body: string;
  created_at: string;
  updated_at: string;
  like_count: number;
  liked_by_me: boolean;
  reply_count: number;
  subcomments: RexCommentRpc[];
};

export type RexCommentDbRow = {
  id: string;
  rex_id: string;
  author_id: string;
  parent_comment_id: string | null;
  body: string;
  created_at: string;
  updated_at: string;
};

export type RexCommentLikeRow = {
  user_id: string;
  comment_id: string;
  created_at: string;
};

export interface RexCommentAuthor {
  display_name: string | null;
  avatar_url: string | null;
  username: string | null;
  relationship_status: string | null;
}

export interface RexComment {
  id: string;
  rex_id: string;
  parent_comment_id: string | null;
  author_id: string;
  body: string;
  created_at: string;
  updated_at: string;
  like_count: number;
  liked_by_me: boolean;
  reply_count: number;
  profile: RexCommentAuthor;
  replies: RexComment[];
}
