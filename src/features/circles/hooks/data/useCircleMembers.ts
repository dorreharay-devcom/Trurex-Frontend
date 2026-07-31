import { useQuery } from '@tanstack/react-query';
import { fetchCircleMembers } from '~/shared/api/circlesApi';
import { CIRCLES_QUERY_KEYS } from '~/features/circles/config/queryKeys';

export function useCircleMembers(circleId: string, enabled: boolean) {
  const { data = [], isLoading } = useQuery({
    queryKey: [CIRCLES_QUERY_KEYS.circleMembers, circleId],
    queryFn: () => fetchCircleMembers(circleId),
    enabled,
  });

  return { members: data, loading: isLoading };
}
