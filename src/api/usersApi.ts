import { Backend } from '~/services/AuthService';
import type { NetworkUserRow, PublicUserRow, UserProfileRow } from '~/types/network';

const DEFAULT_LIMIT = 50;

const PUBLIC_USER_COLUMNS =
  'id,display_name,handle,avatar_url,location,bio,currently_binging,currently_listening_to,currently_reading' as const;

function normalizeHandleForLookup(handle: string): string {
  return handle.trim().replace(/^@/, '');
}

function asArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data == null) return [];
  return [data as T];
}

function isTrustedUsersRpcUnavailable(error: { code?: string; message?: string }): boolean {
  return (
    error.code === 'PGRST202' ||
    (typeof error.message === 'string' && error.message.includes('Could not find the function'))
  );
}

function normalizeNetworkRow(r: Record<string, unknown>): NetworkUserRow {
  const base: NetworkUserRow = {
    user_id: String(r.user_id ?? ''),
    display_name: typeof r.display_name === 'string' ? r.display_name : 'Member',
    handle: typeof r.handle === 'string' ? r.handle : null,
    avatar_url: typeof r.avatar_url === 'string' ? r.avatar_url : null,
    trust_score: typeof r.trust_score === 'number' ? r.trust_score : 0,
    relationship_status:
      r.relationship_status === 'follows_you' ||
      r.relationship_status === 'following' ||
      r.relationship_status === 'trusted'
        ? r.relationship_status
        : null,
    followed_at: typeof r.followed_at === 'string' ? r.followed_at : undefined,
    bio: typeof r.bio === 'string' ? r.bio : null,
  };
  if (typeof r.followers_count === 'number') base.followers_count = r.followers_count;
  if (typeof r.following_count === 'number') base.following_count = r.following_count;
  if (typeof r.rexes_created_count === 'number') base.rexes_created_count = r.rexes_created_count;
  return base;
}

function normalizeUserProfileRow(r: Record<string, unknown>): UserProfileRow {
  const rs = r.relationship_status;
  return {
    user_id: String(r.user_id ?? ''),
    display_name: typeof r.display_name === 'string' ? r.display_name : '',
    handle: typeof r.handle === 'string' ? r.handle : null,
    avatar_url: typeof r.avatar_url === 'string' ? r.avatar_url : null,
    location: typeof r.location === 'string' ? r.location : null,
    bio: typeof r.bio === 'string' ? r.bio : null,
    currently_binging: typeof r.currently_binging === 'string' ? r.currently_binging : null,
    currently_listening_to:
      typeof r.currently_listening_to === 'string' ? r.currently_listening_to : null,
    currently_reading: typeof r.currently_reading === 'string' ? r.currently_reading : null,
    trust_score: typeof r.trust_score === 'number' ? r.trust_score : 0,
    followers_count: typeof r.followers_count === 'number' ? r.followers_count : 0,
    following_count: typeof r.following_count === 'number' ? r.following_count : 0,
    rexes_created_count: typeof r.rexes_created_count === 'number' ? r.rexes_created_count : 0,
    relationship_status: rs === 'follows_you' || rs === 'following' || rs === 'trusted' ? rs : null,
  };
}

async function fetchUserFollowingInternal(inputUserId: string): Promise<NetworkUserRow[]> {
  const { data, error } = await Backend.rpc('user_following', {
    input_limit: 100,
    input_offset: 0,
    input_user_id: inputUserId,
  });
  if (error) throw error;
  return asArray<Record<string, unknown>>(data)
    .map(normalizeNetworkRow)
    .filter((u) => u.user_id);
}

export async function fetchTrustedUsers(inputUserId: string): Promise<NetworkUserRow[]> {
  const parseRows = (payload: unknown) =>
    asArray<Record<string, unknown>>(payload)
      .map(normalizeNetworkRow)
      .filter((u) => u.user_id);

  const { data, error } = await Backend.rpc('trusted_users', {
    input_limit: DEFAULT_LIMIT,
    input_offset: 0,
    input_user_id: inputUserId,
  });
  if (!error) {
    return parseRows(data);
  }

  if (!isTrustedUsersRpcUnavailable(error)) {
    throw error;
  }

  const { data: sessionData } = await Backend.auth.getSession();
  const authId = sessionData.session?.user?.id;
  if (authId != null && authId === inputUserId) {
    const second = await Backend.rpc('trusted_users', {
      input_limit: DEFAULT_LIMIT,
      input_offset: 0,
    });
    if (!second.error) {
      return parseRows(second.data);
    }
  }

  const following = await fetchUserFollowingInternal(inputUserId);
  return following.filter((r) => r.relationship_status === 'trusted');
}

export async function fetchUserFollowing(inputUserId: string): Promise<NetworkUserRow[]> {
  return fetchUserFollowingInternal(inputUserId);
}

export async function fetchUserFollowers(inputUserId: string): Promise<NetworkUserRow[]> {
  const { data, error } = await Backend.rpc('user_followers', {
    input_limit: DEFAULT_LIMIT,
    input_offset: 0,
    input_user_id: inputUserId,
  });
  if (error) throw error;
  return asArray<Record<string, unknown>>(data)
    .map(normalizeNetworkRow)
    .filter((u) => u.user_id);
}

export async function searchUsers(params: {
  input_query: string;
  input_limit?: number;
  input_offset?: number;
}): Promise<NetworkUserRow[]> {
  const { data, error } = await Backend.rpc('search_users', {
    input_query: params.input_query,
    input_limit: params.input_limit ?? 20,
    input_offset: params.input_offset ?? 0,
  });
  if (error) throw error;
  return asArray<Record<string, unknown>>(data)
    .map(normalizeNetworkRow)
    .filter((u) => u.user_id);
}

export async function getUserProfile(params: {
  input_user_id?: string;
  input_handle?: string;
}): Promise<UserProfileRow | null> {
  const payload: { input_user_id?: string; input_handle?: string } = {};
  if (params.input_user_id) payload.input_user_id = params.input_user_id;
  if (params.input_handle != null && params.input_handle.trim() !== '') {
    payload.input_handle = params.input_handle.trim();
  }
  const { data, error } = await Backend.rpc('get_user_profile', payload);
  if (error) throw error;
  if (data == null) return null;
  const raw = Array.isArray(data) ? data[0] : data;
  if (raw == null || typeof raw !== 'object') return null;
  return normalizeUserProfileRow(raw as Record<string, unknown>);
}

export async function fetchUserByHandle(handle: string): Promise<PublicUserRow | null> {
  const h = normalizeHandleForLookup(handle);
  if (!h) return null;
  const { data, error } = await Backend.from('users')
    .select(PUBLIC_USER_COLUMNS)
    .eq('handle', h)
    .maybeSingle();
  if (error) throw error;
  return data as PublicUserRow | null;
}

export async function fetchPublicUserById(userId: string): Promise<PublicUserRow | null> {
  const { data, error } = await Backend.from('users')
    .select(PUBLIC_USER_COLUMNS)
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data as PublicUserRow | null;
}

export async function followUser(input_followed_user_id: string): Promise<void> {
  const { error } = await Backend.rpc('follow_user', { input_followed_user_id });
  if (error) throw error;
}

export async function unfollowUser(input_followed_user_id: string): Promise<void> {
  const { error } = await Backend.rpc('unfollow_user', { input_followed_user_id });
  if (error) throw error;
}

export function filterOneWayFollowing(rows: NetworkUserRow[]): NetworkUserRow[] {
  return rows.filter((r) => r.relationship_status === 'following');
}
