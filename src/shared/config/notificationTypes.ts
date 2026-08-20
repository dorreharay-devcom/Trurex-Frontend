export const NOTIFICATION_TYPE = {
  following: 'following',
  trusted: 'trusted',
  comment: 'comment',
  comment_reply: 'comment_reply',
  reaction: 'reaction',
  reply: 'reply',
  save: 'save',
  follow: 'follow',
  new_follower: 'new_follower',
  follow_request: 'follow_request',
  follow_request_accepted: 'follow_request_accepted',
  message: 'message',
  tier_upgrade: 'tier_upgrade',
} as const;

export type KnownNotificationType = (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];
