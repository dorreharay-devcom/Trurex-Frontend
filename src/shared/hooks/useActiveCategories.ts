import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchActiveCategories, resolveCategoryIconFromRows } from '~/shared/api/categories';

export function useActiveCategories(enabled: boolean) {
  return useQuery({
    queryKey: ['activeCategories'],
    queryFn: fetchActiveCategories,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategoryIcon(categoryCode: string | null | undefined, enabled = true): string {
  const { data } = useActiveCategories(enabled);
  return useMemo(() => resolveCategoryIconFromRows(categoryCode, data), [categoryCode, data]);
}
