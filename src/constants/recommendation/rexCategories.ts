import type { DbCategoryRow } from '~/types/recommendation/rexCategoryCreateConfig';
import { getCategoryEmoji } from '~/constants/recommendation/categoryEmojis';

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
  return {
    id: row.code,
    label: row.display_name,
    emoji: getCategoryEmoji(row.code),
  };
}

export {
  getCategoryEmoji,
  CATEGORY_EMOJI_BY_CODE,
} from '~/constants/recommendation/categoryEmojis';
