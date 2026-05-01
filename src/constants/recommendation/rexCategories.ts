import type { DbCategoryRow } from '~/types/recommendation/rexCategoryCreateConfig';
import { CATEGORY_ICON_FALLBACK } from '~/utils/recommendation/categoryIconResolve';

export const REAL_ESTATE_CATEGORY_CODE = 'real_estate';

export const REAL_ESTATE_CATEGORY_ID = REAL_ESTATE_CATEGORY_CODE;

export type CategoryPickerTile = {
  id: string;
  label: string;
  emoji: string;
};

export function getRexCategoryApiCode(categoryCode: string | null): string | null {
  const c = categoryCode?.trim();
  return c || null;
}

export function categoryRowToPickerTile(row: DbCategoryRow): CategoryPickerTile {
  const icon = row.icon?.trim();
  return {
    id: row.code,
    label: row.display_name,
    emoji: icon && icon.length > 0 ? icon : CATEGORY_ICON_FALLBACK,
  };
}
