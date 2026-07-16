import { Backend, unwrap } from '~/services/AuthService';
import { USER_AVATARS_BUCKET } from '~/constants/storageBuckets';
import type {
  ProfileData,
  UserProfileResponse,
  UserFollowResponse,
  Category,
} from '~/types/profile';
import {
  preparePickerImageForUpload,
  uploadBlobToStorageBucket,
} from '~/utils/photos/storageUpload';

const AVATAR_MAX_WIDTH = 800;

interface UserRow {
  id: string;
  email: string;
  display_name: string;
  handle: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  currently_binging: string | null;
  currently_listening_to: string | null;
  currently_reading: string | null;
  trust_score: number;
  followers_count: number;
  following_count: number;
  rexes_created_count: number;
  relationship_status: string | null;
}

export interface UpdateProfileInput {
  display_name?: string | null;
  handle?: string | null;
  bio?: string | null;
  location?: string | null;
  avatar_url?: string | null;
  currently_binging?: string | null;
  currently_listening_to?: string | null;
  currently_reading?: string | null;
}

function toProfileData(data: UserRow | UserProfileResponse | any, email?: string): ProfileData {
  // Handle array response from RPCs
  const row = Array.isArray(data) ? data[0] : data;

  if (!row) {
    return {
      userId: '',
      displayName: 'Anonymous',
      handle: '',
      avatarUrl: null,
      trustScore: 0,
      rexCount: 0,
      followers: 0,
      following: 0,
      relationshipStatus: null,
    };
  }

  const userId = row.user_id || row.id || '';
  const displayName = row.display_name || '';
  const handle = row.handle || '';
  const avatarUrl = row.avatar_url || null;
  const bio = row.bio ?? '';
  const location = row.location ?? '';
  const trustScore = row.trust_score ?? 0;
  const relationshipStatus = row.relationship_status ?? null;

  return {
    userId,
    displayName: displayName || 'Anonymous',
    handle: handle
      ? handle.startsWith('@')
        ? handle
        : `@${handle}`
      : '',
    bio,
    location,
    avatarUrl,
    trustScore,
    rexCount: row.rexes_created_count ?? 0,
    followers: row.followers_count ?? 0,
    following: row.following_count ?? 0,
    relationshipStatus,
    currently: {
      binging: (row.currently_binging || undefined) ?? undefined,
      listening: (row.currently_listening_to || undefined) ?? undefined,
      reading: (row.currently_reading || undefined) ?? undefined,
    },
  };
}

export const ProfileApi = {
  getCurrentUser: async (userId: string): Promise<UserRow> => {
    const result = unwrap(
      await Backend.rpc('get_user_profile', {
        input_user_id: userId,
      }),
    ) as any;
    const row = Array.isArray(result) ? result[0] : result;
    return { ...row, id: row.user_id } as UserRow;
  },

  getProfile: async (params: { userId?: string; handle?: string }): Promise<ProfileData> => {
    const row = unwrap(
      await Backend.rpc('get_user_profile', {
        input_user_id: params.userId,
        input_handle: params.handle,
      }),
    );
    return toProfileData(row);
  },

  update: async (_userId: string, fields: UpdateProfileInput): Promise<ProfileData> => {
    const row = unwrap(
      await Backend.rpc('update_my_profile', {
        input_display_name: fields.display_name,
        input_handle: fields.handle,
        input_bio: fields.bio,
        input_location: fields.location,
        input_currently_binging: fields.currently_binging,
        input_currently_listening_to: fields.currently_listening_to,
        input_currently_reading: fields.currently_reading,
      }),
    );
    return toProfileData(row);
  },

  updateAvatar: async (avatarUrl: string): Promise<UserRow> => {
    return unwrap(
      await Backend.rpc('update_my_avatar_url', {
        input_avatar_url: avatarUrl,
      }),
    );
  },

  uploadAvatar: async (
    userId: string,
    imageUri: string,
    fileName?: string | null,
    mimeType?: string | null,
  ): Promise<string> => {
    const name = fileName ?? `avatar-${Date.now()}.jpg`;
    const prepared = await preparePickerImageForUpload(
      imageUri,
      name,
      mimeType,
      AVATAR_MAX_WIDTH,
    );
    const path = `${userId}/avatar.jpg`;
    await uploadBlobToStorageBucket(
      USER_AVATARS_BUCKET,
      path,
      prepared.body,
      prepared.contentType,
      { upsert: true },
    );

    await ProfileApi.updateAvatar(path);

    const { data } = Backend.storage.from(USER_AVATARS_BUCKET).getPublicUrl(path);
    return `${data.publicUrl}?t=${Date.now()}`;
  },

  searchUsers: async (query: string, limit = 20, offset = 0): Promise<UserProfileResponse[]> => {
    return unwrap(
      await Backend.rpc('search_users', {
        input_query: query,
        input_limit: limit,
        input_offset: offset,
      }),
    );
  },

  followUser: async (targetUserId: string): Promise<void> => {
    unwrap(
      await Backend.rpc('follow_user', {
        input_followed_user_id: targetUserId,
      }),
    );
  },

  unfollowUser: async (targetUserId: string): Promise<void> => {
    unwrap(
      await Backend.rpc('unfollow_user', {
        input_followed_user_id: targetUserId,
      }),
    );
  },

  getFollowers: async (
    profileUserId?: string,
    limit = 50,
    offset = 0,
  ): Promise<UserFollowResponse[]> => {
    return unwrap(
      await Backend.rpc('user_followers', {
        input_user_id: profileUserId,
        input_limit: limit,
        input_offset: offset,
      }),
    );
  },

  getFollowing: async (
    profileUserId?: string,
    limit = 50,
    offset = 0,
  ): Promise<UserFollowResponse[]> => {
    return unwrap(
      await Backend.rpc('user_following', {
        input_user_id: profileUserId,
        input_limit: limit,
        input_offset: offset,
      }),
    );
  },

  getTrustedUsers: async (
    profileUserId?: string,
    limit = 50,
    offset = 0,
  ): Promise<UserFollowResponse[]> => {
    return unwrap(
      await Backend.rpc('trusted_users', {
        input_user_id: profileUserId,
        input_limit: limit,
        input_offset: offset,
      }),
    );
  },

  getNetworkConnections: async (
    minDegree = 2,
    maxDegree = 3,
    limit = 50,
    offset = 0,
  ): Promise<(UserProfileResponse & { degree: number })[]> => {
    return unwrap(
      await Backend.rpc('follow_degree_connections', {
        input_min_degree: minDegree,
        input_max_degree: maxDegree,
        input_limit: limit,
        input_offset: offset,
      }),
    );
  },

  getCategories: async (): Promise<Category[]> => {
    return unwrap(
      await Backend.from('categories').select('*').order('sort_order', { ascending: true }),
    );
  },
};
