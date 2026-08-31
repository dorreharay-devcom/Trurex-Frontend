import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getRexRequestDetail } from '~/features/rex-requests/api/rexRequestsApi';
import { REX_REQUEST_QUERY_KEYS } from '~/features/rex-requests/config/queryKeys';
import { parseOptionalRouteId } from '~/shared/lib/navigation/routeIds';

export function useRexRequestPage() {
  const raw = useLocalSearchParams<{ id: string | string[] }>();
  const requestId = parseOptionalRouteId(raw.id) ?? '';

  const { data, isPending, isError } = useQuery({
    queryKey: REX_REQUEST_QUERY_KEYS.detail(requestId),
    queryFn: () => getRexRequestDetail(requestId),
    enabled: requestId.length > 0,
  });

  return { requestId, request: data ?? null, isPending, isError };
}

export type RexRequestPageState = ReturnType<typeof useRexRequestPage>;
