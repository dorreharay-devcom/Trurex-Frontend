export type ContentFlagStatus = 'open' | 'reviewing' | 'resolved' | 'dismissed';

export type FlagReasonRow = {
  code: string;
  label: string;
  sort_order: number;
};

export type ContentFlagRow = {
  id: string;
  rex_id: string;
  comment_id: string | null;
  reported_by: string;
  reason_code: string;
  status: ContentFlagStatus;
  created_at: string;
};
