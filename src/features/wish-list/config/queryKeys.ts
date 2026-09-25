export const WISH_LIST_QUERY_KEYS = {
  mine: ['wish-list', 'mine'] as const,
  user: (userId: string) => ['wish-list', 'user', userId] as const,
  productBrandRexes: (search: string) => ['wish-list', 'product-brand-rexes', search] as const,
};
