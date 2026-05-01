import { useMemo } from 'react';
import { useActiveCategories } from '~/hooks/useActiveCategories';
import { resolveCategoryIconFromRows } from '~/utils/recommendation/categoryIconResolve';

export function useCategoryIcon(
  categoryCode: string | null | undefined,
  enabled = true,
): string {
  const { data } = useActiveCategories(enabled);
  return useMemo(
    () => resolveCategoryIconFromRows(categoryCode, data),
    [categoryCode, data],
  );
}
