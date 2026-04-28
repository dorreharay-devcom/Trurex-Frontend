export interface AppNotification {
  id: string;
  user_id: string;
  actor_id: string | null;
  type: string;
  title?: string | null;
  data: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
  actor_profile?: {
    display_name: string | null;
    avatar_url: string | null;
    handle: string | null;
  };
}
