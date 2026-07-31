import { useQuery } from '@tanstack/react-query';
import { fetchActiveCategories } from '~/shared/api';

export function useActiveCategories(enabled: boolean) {
  return useQuery({
    queryKey: ['activeCategories'],
    queryFn: fetchActiveCategories,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
