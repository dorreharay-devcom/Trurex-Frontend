import type { AccountMode } from '~/features/business-account/config/accountMode';

export type MyProfile = {
  id: string;
  kind: AccountMode;
  displayName: string;
  handle: string | null;
  avatarUrl: string | null;
  verified: boolean;
};
