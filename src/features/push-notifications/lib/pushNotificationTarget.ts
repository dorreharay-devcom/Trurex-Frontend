import type { Href } from 'expo-router';
import { NOTIFICATION_TYPE } from '~/shared/config/notificationTypes';
import { notificationOpenTarget } from '~/shared/lib/notification/helpers';
import type { AppNotification } from '~/shared/types/appNotification';
import { Routes, toRexRoute, toUserRoute } from '~/shared/config/routes';

type PushData = Record<string, unknown> | null | undefined;

function stringField(data: PushData, key: string): string {
  const value = data?.[key];
  return typeof value === 'string' ? value.trim() : '';
}

function toAppNotificationShape(data: PushData): AppNotification {
  return {
    id: '',
    actor_id: stringField(data, 'actor_id') || null,
    type: stringField(data, 'type'),
    data: data ?? null,
    is_read: true,
    created_at: '',
    rex_id: stringField(data, 'rex_id'),
    comment_id: stringField(data, 'comment_id'),
  };
}

export function resolvePushNotificationHref(data: PushData): Href | null {
  const notification = toAppNotificationShape(data);

  const target = notificationOpenTarget(notification);
  if (target?.kind === 'rex') return toRexRoute(target.rexId, target.options);
  if (target?.kind === 'user') return toUserRoute(target.userId);

  if (stringField(data, 'type') === NOTIFICATION_TYPE.tier_upgrade) return Routes.Profile;

  const rexId = stringField(data, 'rex_id') || stringField(data, 'recommendation_id');
  if (rexId) return toRexRoute(rexId);

  const actorId = stringField(data, 'actor_id') || stringField(data, 'user_id');
  if (actorId) return toUserRoute(actorId);

  return null;
}
