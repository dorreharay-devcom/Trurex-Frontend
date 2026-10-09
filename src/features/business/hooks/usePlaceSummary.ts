import { useQuery } from '@tanstack/react-query';
import { fetchPlaceSummary } from '~/features/business/api/placeSummaryApi';
import { PLACE_SUMMARY_QUERY_KEY } from '~/shared/config/queryKeys';

export function usePlaceSummary(rexId: string) {
  return useQuery({
    queryKey: PLACE_SUMMARY_QUERY_KEY(rexId),
    queryFn: () => fetchPlaceSummary(rexId),
    enabled: rexId.length > 0,
    staleTime: 60_000,
  });
}
