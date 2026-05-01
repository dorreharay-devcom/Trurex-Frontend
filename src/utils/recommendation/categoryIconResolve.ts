import type { DbCategoryRow } from '~/types/recommendation/rexCategoryCreateConfig';

/** Shown when the API has not returned an icon yet or the category is unknown. */
export const CATEGORY_ICON_FALLBACK = '📍';

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
