const PRODUCT_BRAND_REXES_BASE_KEY = ['wish-list', 'product-brand-rexes'] as const;
const PROFILE_PREVIEW_BASE_KEY = ['wish-list', 'profile-preview'] as const;

export const WISH_LIST_QUERY_KEYS = {
  mine: ['wish-list', 'mine'] as const,
  user: (userId: string) => ['wish-list', 'user', userId] as const,
  productBrandRexesBase: PRODUCT_BRAND_REXES_BASE_KEY,
  productBrandRexes: (search: string) => [...PRODUCT_BRAND_REXES_BASE_KEY, search] as const,
  profilePreviewBase: PROFILE_PREVIEW_BASE_KEY,
  profilePreview: (userId: string, isOwnProfile: boolean) =>
    [...PROFILE_PREVIEW_BASE_KEY, userId, isOwnProfile] as const,
};
