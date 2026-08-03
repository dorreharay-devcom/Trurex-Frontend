import { Backend } from '~/shared/api/client';
import type { BlockedUserRow } from '~/features/profile/types/blockedUser';
import { coerceId, optStr, unknownAsArray } from '~/shared/lib/data/guards';
import { throwRpcIfFailed } from '~/shared/lib/errors/restriction';

function normalizeBlockedUserRow(r: Record<string, unknown>): BlockedUserRow {
  return {
    user_id: coerceId(r.user_id),
    display_name: optStr(r.display_name) ?? 'Member',
    handle: optStr(r.handle),
    avatar_url: optStr(r.avatar_url),
    blocked_at: optStr(r.blocked_at) ?? '',
  };
}

export async function blockUser(targetUserId: string): Promise<void> {
  throwRpcIfFailed(
    await Backend.rpc('block_user', {
      p_target_user_id: targetUserId,
    }),
  );
}

export async function unblockUser(targetUserId: string): Promise<void> {
  throwRpcIfFailed(
    await Backend.rpc('unblock_user', {
      p_target_user_id: targetUserId,
    }),
  );
}

export async function fetchBlockedUsers(): Promise<BlockedUserRow[]> {
  const { data, error } = await Backend.rpc('get_blocked_users');
  throwRpcIfFailed({ data, error });
  return unknownAsArray<Record<string, unknown>>(data)
    .map(normalizeBlockedUserRow)
    .filter((row) => row.user_id);
}
