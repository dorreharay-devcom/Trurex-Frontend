import { Backend } from '~/services/AuthService';
import type { NetworkUserRow, PublicUserRow, UserConfigRow, UserProfileRow } from '~/types/network';
import { isPlainObject } from '~/utils';

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

function coerceId(v: unknown): string {
  if (v == null) return '';
  return typeof v === 'string' ? v : String(v);
}

function optStr(v: unknown): string | null {
  return typeof v === 'string' ? v : null;
}

function optStrUndef(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined;
}

function finiteNum(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

type RelTriplet = 'follows_you' | 'following' | 'trusted';

function relTriplet(v: unknown): RelTriplet | null {
  return v === 'follows_you' || v === 'following' || v === 'trusted' ? v : null;
}

function normalizeNetworkRow(r: Record<string, unknown>): NetworkUserRow {
  const row: NetworkUserRow = {
    user_id: coerceId(r.user_id),
    display_name: optStr(r.display_name) ?? 'Member',
    handle: optStr(r.handle),
    avatar_url: optStr(r.avatar_url),
    trust_score: finiteNum(r.trust_score),
    relationship_status: relTriplet(r.relationship_status),
    followed_at: optStrUndef(r.followed_at),
    bio: optStr(r.bio),
  };
  if (typeof r.followers_count === 'number') row.followers_count = r.followers_count;
  if (typeof r.following_count === 'number') row.following_count = r.following_count;
  if (typeof r.rexes_created_count === 'number') row.rexes_created_count = r.rexes_created_count;
  return row;
}

function normalizeUserProfileRow(r: Record<string, unknown>): UserProfileRow {
  return {
    user_id: coerceId(r.user_id),
    display_name: optStr(r.display_name) ?? '',
    handle: optStr(r.handle),
    avatar_url: optStr(r.avatar_url),
    location: optStr(r.location),
    bio: optStr(r.bio),
    currently_binging: optStr(r.currently_binging),
    currently_listening_to: optStr(r.currently_listening_to),
    currently_reading: optStr(r.currently_reading),
    trust_score: finiteNum(r.trust_score),
    followers_count: finiteNum(r.followers_count),
    following_count: finiteNum(r.following_count),
    rexes_created_count: finiteNum(r.rexes_created_count),
    relationship_status: relTriplet(r.relationship_status),
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

const emptyUserConfig = (): UserConfigRow => ({
  avatar_url: null,
  pinned_category_ids: [],
});

function normalizeUserConfigResponse(data: unknown): UserConfigRow {
  if (data == null) {
    return emptyUserConfig();
  }
  if (Array.isArray(data) && isPlainObject(data[0])) {
    return data[0] as UserConfigRow;
  }
  if (isPlainObject(data) && 'pinned_category_ids' in data) {
    return data as UserConfigRow;
  }
  return emptyUserConfig();
}

export async function fetchUserConfig(): Promise<UserConfigRow> {
  const { data, error } = await Backend.rpc('user_config');
  if (error) throw error;
  return normalizeUserConfigResponse(data);
}
