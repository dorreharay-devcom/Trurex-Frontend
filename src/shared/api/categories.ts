import { Backend } from '~/shared/api/client';
import { throwRpcIfFailed } from '~/utils/mutationRestrictionError';

export type DbCategoryRow = {
  id: string;
  code: string;
  display_name: string;
  sort_order: number;
  icon?: string | null;
};

export const CATEGORY_ICON_FALLBACK = '📍';

export async function fetchActiveCategories(): Promise<DbCategoryRow[]> {
  const { data, error } = await Backend.from('categories')
    .select('id, code, display_name, sort_order, icon')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  throwRpcIfFailed({ data, error });
  return (data ?? []) as DbCategoryRow[];
}

export function resolveCategoryIconFromRows(
  categoryCode: string | null | undefined,
  rows: DbCategoryRow[] | undefined | null,
): string {
  const code = categoryCode?.trim();
  if (!code || !rows?.length) return CATEGORY_ICON_FALLBACK;
  const row = rows.find((r) => r.code === code);
  const icon = row?.icon?.trim();
  return icon && icon.length > 0 ? icon : CATEGORY_ICON_FALLBACK;
}
