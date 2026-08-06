import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  dismissPeopleSuggestion,
  fetchPeopleSuggestions,
  followUserFromPeopleSuggestion,
} from '~/features/circles/api/peopleSuggestionsApi';
import {
  CIRCLES_QUERY_KEYS,
  CONNECTION_DEPENDENT_QUERY_KEYS,
} from '~/features/circles/config/queryKeys';
import { mutationErrorToast } from '~/shared/lib/errors/restriction';
import { withOnlineMutation } from '~/shared/lib/network/assertOnline';
import { toastSuccess } from '~/shared/lib/appToast';

const SUGGESTIONS_LIMIT = 20;
const SUGGESTIONS_STALE_MS = 60_000;

export function usePeopleSuggestions(enabled: boolean) {
  const queryClient = useQueryClient();

  const {
    data: suggestions = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: CIRCLES_QUERY_KEYS.peopleSuggestions,
    queryFn: () => fetchPeopleSuggestions({ input_limit: SUGGESTIONS_LIMIT, input_offset: 0 }),
    enabled,
    staleTime: SUGGESTIONS_STALE_MS,
  });

  const invalidateSuggestions = () => {
    void queryClient.invalidateQueries({ queryKey: CIRCLES_QUERY_KEYS.peopleSuggestions });
  };

  const dismissFn = withOnlineMutation('People suggestions', dismissPeopleSuggestion);
  const followFn = withOnlineMutation('Following', followUserFromPeopleSuggestion);

  const dismissMutation = useMutation({
    mutationFn: dismissFn,
    onSuccess: invalidateSuggestions,
    onError: mutationErrorToast('Could not dismiss'),
  });

  const followMutation = useMutation({
    mutationFn: followFn,
    onSuccess: () => {
      toastSuccess('Following');
      invalidateSuggestions();
      for (const queryKey of CONNECTION_DEPENDENT_QUERY_KEYS) {
        void queryClient.invalidateQueries({ queryKey });
      }
    },
    onError: mutationErrorToast('Could not follow'),
  });

  return {
    suggestions,
    isLoading,
    isError,
    refetch,
    dismiss: (userId: string) => dismissMutation.mutate(userId),
    follow: (userId: string) => followMutation.mutate(userId),
    isDismissing: (userId: string) =>
      dismissMutation.isPending && dismissMutation.variables === userId,
    isFollowPending: (userId: string) =>
      followMutation.isPending && followMutation.variables === userId,
  };
}
