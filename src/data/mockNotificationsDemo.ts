import type { AppNotification } from '~/types/notification/appNotification';

export function getMockNotificationsDemo(): AppNotification[] {
  const now = Date.now();
  const minsAgo = (m: number) => new Date(now - m * 60_000).toISOString();
  const hoursAgo = (h: number) => new Date(now - h * 3600_000).toISOString();

  return [
    {
      id: 'mock-1',
      user_id: 'demo-user',
      actor_id: 'actor-1',
      type: 'reaction',
      data: {
        recommendation_id: 'rex-demo-1',
        recommendation_title: 'Otto’s Turkish Pizza',
      },
      is_read: false,
      created_at: minsAgo(12),
      actor_display_name: 'Sam Rivera',
      actor_avatar_url: null,
      actor_handle: 'samrivera',
    },
    {
      id: 'mock-2',
      user_id: 'demo-user',
      actor_id: 'actor-2',
      type: 'comment',
      data: {
        recommendation_id: 'rex-demo-2',
        recommendation_title: 'Little Marionette',
      },
      is_read: false,
      created_at: minsAgo(45),
      actor_display_name: 'Jordan Lee',
      actor_avatar_url: null,
      actor_handle: 'jordanlee',
    },
    {
      id: 'mock-3',
      user_id: 'demo-user',
      actor_id: 'actor-3',
      type: 'new_follower',
      data: null,
      is_read: true,
      created_at: hoursAgo(3),
      actor_display_name: 'Alex Kim',
      actor_avatar_url: null,
      actor_handle: 'alexkim',
      show_followback: true,
    },
    {
      id: 'mock-4',
      user_id: 'demo-user',
      actor_id: 'actor-4',
      type: 'save',
      data: {
        recommendation_id: 'rex-demo-4',
        recommendation_title: 'Golden Age Cinema',
      },
      is_read: true,
      created_at: hoursAgo(8),
      actor_display_name: 'Priya N.',
      actor_avatar_url: null,
      actor_handle: 'priyan',
    },
    {
      id: 'mock-5',
      user_id: 'demo-user',
      actor_id: 'actor-5',
      type: 'trusted',
      data: null,
      is_read: false,
      created_at: hoursAgo(26),
      actor_display_name: 'Morgan Wells',
      actor_avatar_url: null,
      actor_handle: 'morganwells',
    },
    {
      id: 'mock-6',
      user_id: 'demo-user',
      actor_id: 'actor-6',
      type: 'reply',
      data: {
        recommendation_id: 'rex-demo-6',
        recommendation_title: 'Batch Brewing',
      },
      is_read: true,
      created_at: hoursAgo(48),
      actor_display_name: "Casey O'Neill",
      actor_avatar_url: null,
      actor_handle: 'caseyoneill',
    },
  ];
}
