export interface ProfileData {
  displayName: string;
  handle: string;
  bio?: string;
  location?: string;
  avatarUrl: string | null;
  trustScore: number;
  rexCount: number;
  followers: number;
  following: number;
  currently?: {
    binging?: string;
    listening?: string;
    reading?: string;
  };
}
