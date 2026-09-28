const PRODUCT_BRAND_REXES_BASE_KEY = ['wish-list', 'product-brand-rexes'] as const;

export const WISH_LIST_QUERY_KEYS = {
  mine: ['wish-list', 'mine'] as const,
  user: (userId: string) => ['wish-list', 'user', userId] as const,
  productBrandRexesBase: PRODUCT_BRAND_REXES_BASE_KEY,
  productBrandRexes: (search: string) => [...PRODUCT_BRAND_REXES_BASE_KEY, search] as const,
};
