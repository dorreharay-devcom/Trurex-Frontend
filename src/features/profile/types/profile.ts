import type { AccountKind } from '~/features/business-account/config/accountKind';
import type { RelationshipStatus as KnownRelationshipStatus } from '~/shared/config/relationshipStatus';

export type RelationshipStatus = KnownRelationshipStatus | null;

export type CurrentlyData = {
  binging?: string;
  listening?: string;
  reading?: string;
};

export type PendingAvatar = {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
  dispose?: () => void;
};

export type ProfileBusinessIdentity = {
  name: string | null;
  photoPath: string | null;
  verified: boolean;
  placeId: string | null;
};

export type ProfileData = {
  userId: string;
  displayName: string;
  handle: string;
  bio?: string;
  location?: string;
  avatarUrl: string | null;
  trustScore: number;
  rexScore: number;
  rexTier: string | null;
  rexCount: number;
  followers: number;
  following: number;
  relationshipStatus: RelationshipStatus;
  currently?: CurrentlyData;
  verified: boolean;
  accountKind: AccountKind;
  business: ProfileBusinessIdentity | null;
};

export type ProfileUserRow = {
  id: string;
  email?: string;
  display_name: string;
  handle: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  currently_binging: string | null;
  currently_listening_to: string | null;
  currently_reading: string | null;
  trust_score: number;
  rex_score: number;
  rex_tier: string | null;
  followers_count: number;
  following_count: number;
  rexes_created_count: number;
  relationship_status: RelationshipStatus | string | null;
  user_id?: string;
  verified?: boolean | null;
  is_business_account?: boolean | null;
  account_type?: string | null;
  business_name?: string | null;
  business_photo_path?: string | null;
  is_verified_business?: boolean | null;
  business_place_id?: string | null;
};

export type UpdateProfileInput = {
  display_name?: string | null;
  handle?: string | null;
  bio?: string | null;
  location?: string | null;
  avatar_url?: string | null;
  currently_binging?: string | null;
  currently_listening_to?: string | null;
  currently_reading?: string | null;
};
