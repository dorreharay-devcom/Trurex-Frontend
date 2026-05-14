import { Backend } from '~/services/AuthService';
import type { PeopleSuggestionRow } from '~/types/peopleSuggestions';
import { throwRpcIfFailed } from '~/utils/mutationRestrictionError';

export async function fetchPeopleSuggestions(params?: {
  input_limit?: number;
  input_offset?: number;
}): Promise<PeopleSuggestionRow[]> {
  const { data, error } = await Backend.rpc('get_people_suggestions', {
    input_limit: params?.input_limit ?? 20,
    input_offset: params?.input_offset ?? 0,
  });
  throwRpcIfFailed({ data, error });
  if (!Array.isArray(data)) return [];
  return data as PeopleSuggestionRow[];
}

export async function dismissPeopleSuggestion(input_candidate_user_id: string): Promise<void> {
  throwRpcIfFailed(
    await Backend.rpc('dismiss_people_suggestion', {
      input_candidate_user_id,
    }),
  );
}

export async function followUserFromPeopleSuggestion(
  input_candidate_user_id: string,
): Promise<unknown> {
  const { data, error } = await Backend.rpc('follow_user_from_people_suggestion', {
    input_candidate_user_id,
  });
  throwRpcIfFailed({ data, error });
  return data;
}
