import { Backend, unwrap } from '~/shared/api/client';
import { coerceId, firstNonEmptyString, unknownAsArray } from '~/shared/lib/data/guards';
import type { MentionCandidate } from '~/features/mentions/types/mention';

function normalizeMentionCandidate(row: Record<string, unknown>): MentionCandidate | null {
  const userId = coerceId(row.user_id ?? row.id);
  const handle = firstNonEmptyString(row, 'handle');
  if (!userId || !handle) return null;

  return {
    userId,
    handle,
    displayName: firstNonEmptyString(row, 'display_name', 'full_name') ?? handle,
    avatarUrl: firstNonEmptyString(row, 'avatar_url'),
  };
}

export async function searchMentionCandidates(params: {
  query: string;
  limit: number;
  offset: number;
}): Promise<MentionCandidate[]> {
  const data = unwrap(
    await Backend.rpc('search_users_by_handle', {
      p_query: params.query,
      p_limit: params.limit,
      p_offset: params.offset,
    }),
  );

  return unknownAsArray<Record<string, unknown>>(data)
    .map(normalizeMentionCandidate)
    .filter((candidate): candidate is MentionCandidate => candidate !== null);
}

export async function resolveUserByHandle(handle: string): Promise<MentionCandidate | null> {
  const normalized = handle.toLowerCase();
  const candidates = await searchMentionCandidates({ query: handle, limit: 5, offset: 0 });
  return candidates.find((candidate) => candidate.handle.toLowerCase() === normalized) ?? null;
}
