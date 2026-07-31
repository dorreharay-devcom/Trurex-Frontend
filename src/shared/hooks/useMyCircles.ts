import { useQuery } from '@tanstack/react-query';
import { fetchMyCircles } from '~/shared/api/circlesApi';
import { CIRCLE_QUERY_KEYS } from '~/shared/config/queryKeys';

const MY_CIRCLES_STALE_MS = 2 * 60 * 1000;

export function useMyCircles(enabled: boolean) {
  return useQuery({
    queryKey: CIRCLE_QUERY_KEYS.myCircles,
    queryFn: fetchMyCircles,
    enabled,
    staleTime: MY_CIRCLES_STALE_MS,
  });
}
