export const REX_REQUEST_QUERY_KEYS = {
  feed: ['rex-requests', 'feed'] as const,
  detail: (id: string) => ['rex-requests', 'detail', id] as const,
  responses: (id: string) => ['rex-requests', 'responses', id] as const,
  comments: (id: string) => ['rex-requests', 'comments', id] as const,
  profile: (userId: string | undefined, isOwnProfile: boolean) =>
    ['rex-requests', 'profile', userId, isOwnProfile] as const,
};
