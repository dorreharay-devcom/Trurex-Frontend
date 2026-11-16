export type UserConfigRow = {
  avatar_url: string | null;
  pinned_category_ids: string[];
  status?: 'active' | 'frozen' | 'suspended' | string | null;
  is_business_account?: boolean | null;
  business_claim_status?: string | null;
  account_type?: string | null;
};
