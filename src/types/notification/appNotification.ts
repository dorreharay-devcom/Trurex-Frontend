export interface AppNotification {
  id: string;
  user_id?: string;
  actor_id: string | null;
  type: string;
  title?: string | null;
  data: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
  actor_display_name?: string | null;
  actor_handle?: string | null;
  actor_avatar_url?: string | null;
  show_followback?: boolean;
  unread_count?: number;
}
