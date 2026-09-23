export type ReferredUser = {
  id: string;
  handle: string | null;
  display_name: string;
  avatar_url: string | null;
  signup_rewarded: boolean;
  activation_rewarded: boolean;
  joined_at: string;
};

export type ReferralInfo = {
  referral_code: string | null;
  total_referrals: number;
  rewarded_referrals: number;
  referred_users: ReferredUser[];
};
