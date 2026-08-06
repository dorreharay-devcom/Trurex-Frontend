import { Backend, unwrap } from '~/shared/api/client';
import { throwRpcIfFailed } from '~/shared/lib/errors/restriction';
import type { AppNotification } from '~/shared/types/appNotification';

export async function fetchUserNotifications(): Promise<AppNotification[]> {
  const raw = unwrap(
    await Backend.rpc('user_notifications', { result_limit: 50, result_offset: 0 }),
  );
  if (!Array.isArray(raw)) return [];
  return raw as AppNotification[];
}

export async function markNotificationsRead(ids?: string[]): Promise<void> {
  const params = ids?.length ? { input_ids: ids } : {};
  throwRpcIfFailed(await Backend.rpc('mark_notifications_read', params));
}

export function unreadCountFromNotifications(list: AppNotification[]): number {
  const reported = list[0]?.unread_count;
  if (typeof reported === 'number' && Number.isFinite(reported)) return Math.max(0, reported);
  return list.filter((n) => !n.is_read).length;
}
