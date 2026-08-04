export type UserConfigRow = {
  avatar_url: string | null;
  pinned_category_ids: string[];
  status?: 'active' | 'frozen' | 'suspended' | string | null;
};
