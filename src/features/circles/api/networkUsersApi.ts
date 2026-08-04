import { Backend } from '~/shared/api/client';
import { parseNetworkUserRows } from '~/features/circles/lib/networkUserRow';
import type { NetworkUserRow, SearchUsersScope } from '~/features/circles/types/networkUser';
import { RELATIONSHIP_STATUS } from '~/shared/config/relationshipStatus';
import { throwRpcIfFailed } from '~/shared/lib/errors/restriction';

const DEFAULT_LIMIT = 50;

function isTrustedUsersRpcUnavailable(error: { code?: string; message?: string }): boolean {
  return (
    error.code === 'PGRST202' ||
    (typeof error.message === 'string' && error.message.includes('Could not find the function'))
  );
}

export async function fetchUserFollowing(
  inputUserId: string,
  limit = DEFAULT_LIMIT,
  offset = 0,
): Promise<NetworkUserRow[]> {
  const { data, error } = await Backend.rpc('user_following', {
    input_limit: limit,
    input_offset: offset,
    input_user_id: inputUserId,
  });
  throwRpcIfFailed({ data, error });
  return parseNetworkUserRows(data);
}

export async function fetchTrustedUsers(
  inputUserId: string,
  limit = DEFAULT_LIMIT,
  offset = 0,
): Promise<NetworkUserRow[]> {
  const { data, error } = await Backend.rpc('trusted_users', {
    input_limit: limit,
    input_offset: offset,
    input_user_id: inputUserId,
  });
  if (!error) return parseNetworkUserRows(data);

  if (!isTrustedUsersRpcUnavailable(error)) {
    throwRpcIfFailed({ data, error });
  }

  const { data: sessionData } = await Backend.auth.getSession();
  const authId = sessionData.session?.user?.id;
  if (authId != null && authId === inputUserId) {
    const second = await Backend.rpc('trusted_users', {
      input_limit: limit,
      input_offset: offset,
    });
    if (!second.error) return parseNetworkUserRows(second.data);
  }

  const following = await fetchUserFollowing(inputUserId, limit, offset);
  return following.filter((r) => r.relationship_status === RELATIONSHIP_STATUS.trusted);
}

export async function fetchUserFollowers(
  inputUserId: string,
  limit = DEFAULT_LIMIT,
  offset = 0,
): Promise<NetworkUserRow[]> {
  const { data, error } = await Backend.rpc('user_followers', {
    input_limit: limit,
    input_offset: offset,
    input_user_id: inputUserId,
  });
  throwRpcIfFailed({ data, error });
  return parseNetworkUserRows(data);
}

export async function searchUsers(params: {
  input_query?: string | null;
  input_limit?: number;
  input_offset?: number;
  input_scope?: SearchUsersScope;
  input_user_id?: string | null;
}): Promise<NetworkUserRow[]> {
  const q = params.input_query?.trim() ?? '';
  const payload: Record<string, unknown> = {
    input_query: q.length > 0 ? q : null,
    input_limit: params.input_limit ?? 20,
    input_offset: params.input_offset ?? 0,
    input_scope: params.input_scope ?? 'all_users',
  };
  if (params.input_user_id) payload.input_user_id = params.input_user_id;

  const { data, error } = await Backend.rpc('search_users', payload);
  throwRpcIfFailed({ data, error });
  return parseNetworkUserRows(data);
}
