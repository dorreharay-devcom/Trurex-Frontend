import { NOTIFICATION_TYPE } from '~/shared/config/notificationTypes';
import type { AppNotification } from '~/shared/types/appNotification';
import type { RecommendationOpenOptions } from '~/shared/types/recommendation';
import { formatCompactRelativeTime } from '~/shared/lib/data/date';

const REX_TYPES = new Set<string>([
  NOTIFICATION_TYPE.comment,
  NOTIFICATION_TYPE.comment_reply,
  NOTIFICATION_TYPE.reply,
  NOTIFICATION_TYPE.reaction,
  NOTIFICATION_TYPE.thank,
  NOTIFICATION_TYPE.first_thank,
  NOTIFICATION_TYPE.milestone_thank,
]);

const REX_REQUEST_TYPES = new Set<string>([
  NOTIFICATION_TYPE.rex_request,
  NOTIFICATION_TYPE.rex_request_response,
]);

const COMMENT_TYPES = new Set<string>([
  NOTIFICATION_TYPE.comment,
  NOTIFICATION_TYPE.comment_reply,
  NOTIFICATION_TYPE.reply,
]);

const FOLLOWABLE_TYPES = new Set<string>([
  NOTIFICATION_TYPE.follow,
  NOTIFICATION_TYPE.following,
  NOTIFICATION_TYPE.new_follower,
]);

const PROFILE_TYPES = new Set<string>([
  NOTIFICATION_TYPE.follow,
  NOTIFICATION_TYPE.following,
  NOTIFICATION_TYPE.new_follower,
  NOTIFICATION_TYPE.trusted,
]);

const DEFAULT_VERB = 'interacted with your Rex';

const VERB_BY_TYPE: Record<string, string> = {
  [NOTIFICATION_TYPE.reaction]: 'hearted your Rex',
  [NOTIFICATION_TYPE.comment]: 'commented on your Rex',
  [NOTIFICATION_TYPE.comment_reply]: 'replied to your comment',
  [NOTIFICATION_TYPE.reply]: 'replied to your comment',
  [NOTIFICATION_TYPE.save]: 'saved your Rex',
  [NOTIFICATION_TYPE.follow]: 'started following you',
  [NOTIFICATION_TYPE.following]: 'started following you',
  [NOTIFICATION_TYPE.new_follower]: 'started following you',
  [NOTIFICATION_TYPE.follow_request]: 'wants to follow you',
  [NOTIFICATION_TYPE.follow_request_accepted]: 'accepted your follow request',
  [NOTIFICATION_TYPE.trusted]: 'is now Trusted',
  [NOTIFICATION_TYPE.message]: 'sent you a message',
  [NOTIFICATION_TYPE.tier_upgrade]: 'reached a new RexScore tier',
  [NOTIFICATION_TYPE.thank]: 'thanked your Rex',
  [NOTIFICATION_TYPE.first_thank]: 'thanked your Rex',
  [NOTIFICATION_TYPE.milestone_thank]: 'thanked your Rex',
  [NOTIFICATION_TYPE.rex_request]: 'posted a Rex Request to your circle',
  [NOTIFICATION_TYPE.rex_request_response]: 'responded to your Rex Request',
};

export type NotificationRexLink = {
  rexId: string;
  options: RecommendationOpenOptions;
};

export type NotificationOpenTarget =
  | ({ kind: 'rex' } & NotificationRexLink)
  | { kind: 'user'; userId: string }
  | { kind: 'rexRequest'; requestId: string };

function trimOrEmpty(value: string | null | undefined): string {
  return value?.trim() ?? '';
}

function dataString(data: AppNotification['data'], key: string): string {
  if (!data) return '';
  const value = data[key];
  return typeof value === 'string' ? value.trim() : '';
}

function rexOpenOptions(n: AppNotification): RecommendationOpenOptions {
  const commentId = trimOrEmpty(n.comment_id);
  if (commentId) return { scrollToCommentId: commentId };
  if (COMMENT_TYPES.has(n.type)) return { scrollToComments: true };
  return {};
}

export function notificationRexDeepLink(n: AppNotification): NotificationRexLink | null {
  if (!REX_TYPES.has(n.type)) return null;

  const rexId = trimOrEmpty(n.rex_id) || dataString(n.data, 'recommendation_id');
  if (!rexId) return null;

  return { rexId, options: rexOpenOptions(n) };
}

export function notificationRexRequestDeepLink(n: AppNotification): string | null {
  if (!REX_REQUEST_TYPES.has(n.type)) return null;
  return trimOrEmpty(n.rex_request_id) || dataString(n.data, 'rex_request_id') || null;
}

export function notificationOpenTarget(n: AppNotification): NotificationOpenTarget | null {
  const requestId = notificationRexRequestDeepLink(n);
  if (requestId) return { kind: 'rexRequest', requestId };

  const rex = notificationRexDeepLink(n);
  if (rex) return { kind: 'rex', ...rex };

  const userId = trimOrEmpty(n.actor_id);
  if (PROFILE_TYPES.has(n.type) && userId) return { kind: 'user', userId };

  return null;
}

export function isFollowableNotificationType(type: string): boolean {
  return FOLLOWABLE_TYPES.has(type);
}

export function canShowFollowBack(n: AppNotification): boolean {
  return (
    isFollowableNotificationType(n.type) &&
    Boolean(trimOrEmpty(n.actor_id)) &&
    n.show_followback === true
  );
}

export function notificationActorLabel(n: AppNotification): string {
  const displayName = trimOrEmpty(n.actor_display_name);
  if (displayName) return displayName;

  const handle = trimOrEmpty(n.actor_handle);
  if (!handle) return 'Someone';
  return handle.startsWith('@') ? handle : `@${handle}`;
}

export function notificationDescription(n: AppNotification): string {
  if (n.title) return n.title;

  const actor = notificationActorLabel(n);
  if (n.type === NOTIFICATION_TYPE.trusted) return `${actor} is now Trusted`;

  const place = dataString(n.data, 'recommendation_title');
  const verb = VERB_BY_TYPE[n.type] ?? DEFAULT_VERB;
  return place ? `${actor} ${verb} — ${place}` : `${actor} ${verb}`;
}

export function notificationRelativeTime(iso: string): string {
  const compact = formatCompactRelativeTime(iso);
  if (!compact) return '';
  if (compact === 'now') return 'just now';
  return `${compact} ago`;
}
