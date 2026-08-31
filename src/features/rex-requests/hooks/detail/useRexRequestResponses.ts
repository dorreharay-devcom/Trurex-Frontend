import { useQuery } from '@tanstack/react-query';
import { getRexRequestResponses } from '~/features/rex-requests/api/rexRequestsApi';
import { REX_REQUEST_QUERY_KEYS } from '~/features/rex-requests/config/queryKeys';

export function useRexRequestResponses(requestId: string) {
  const query = useQuery({
    queryKey: REX_REQUEST_QUERY_KEYS.responses(requestId),
    queryFn: () => getRexRequestResponses(requestId),
    enabled: requestId.length > 0,
  });

  return {
    responses: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
