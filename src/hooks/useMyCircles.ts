import { useQuery } from '@tanstack/react-query';
import { fetchMyCircles } from '~/api/circlesApi';

export function useMyCircles(enabled: boolean) {
  return useQuery({
    queryKey: ['myCircles'],
    queryFn: fetchMyCircles,
    enabled,
    staleTime: 2 * 60 * 1000,
  });
}
