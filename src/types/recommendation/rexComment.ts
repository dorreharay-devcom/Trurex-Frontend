export interface RexCommentRow {
  id: string;
  rex_id: string;
  author_id: string;
  body: string;
  created_at: string;
  updated_at: string;
  parent_comment_id?: string | null;
}

export interface RexCommentAuthor {
  display_name: string | null;
  avatar_url: string | null;
}

export interface RexComment extends RexCommentRow {
  profile?: RexCommentAuthor;
  replies?: RexComment[];
}
