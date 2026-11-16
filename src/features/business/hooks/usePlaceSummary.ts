import { skipToken, useQuery } from '@tanstack/react-query';
import { fetchPlaceSummary } from '~/features/business/api/placeSummaryApi';
import { PLACE_SUMMARY_QUERY_KEY } from '~/shared/config/queryKeys';
import type { PlaceRef } from '~/shared/types/placeRef';

export function usePlaceSummary(ref: PlaceRef | null) {
  return useQuery({
    queryKey: PLACE_SUMMARY_QUERY_KEY(ref),
    queryFn: ref ? () => fetchPlaceSummary(ref) : skipToken,
    staleTime: 60_000,
  });
}
