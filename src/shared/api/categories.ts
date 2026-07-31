import { Backend } from '~/shared/api/client';
import { throwRpcIfFailed } from '~/utils/mutationRestrictionError';
import type { DbCategoryRow } from '~/types/recommendation/rexCategoryCreateConfig';

export async function fetchActiveCategories(): Promise<DbCategoryRow[]> {
  const { data, error } = await Backend.from('categories')
    .select('id, code, display_name, sort_order, icon')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  throwRpcIfFailed({ data, error });
  return (data ?? []) as DbCategoryRow[];
}
