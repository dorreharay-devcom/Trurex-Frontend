import type { KnownNotificationType } from '~/shared/config/notificationTypes';

export type AppNotificationType = KnownNotificationType | (string & {});

export interface AppNotification {
  id: string;
  user_id?: string;
  actor_id: string | null;
  type: AppNotificationType;
  title?: string | null;
  body?: string | null;
  data: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
  actor_display_name?: string | null;
  actor_handle?: string | null;
  actor_avatar_url?: string | null;
  show_followback?: boolean;
  unread_count?: number;
  rex_id?: string | null;
  comment_id?: string | null;
}
