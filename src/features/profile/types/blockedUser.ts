export type BlockedUserRow = {
  user_id: string;
  display_name: string;
  handle: string | null;
  avatar_url: string | null;
  verified: boolean;
  blocked_at: string;
};
