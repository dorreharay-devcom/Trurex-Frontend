import type { Recommendation } from '~/shared/types/recommendation';
import {
  PRODUCT_BRAND_CATEGORY_CODE,
  PRODUCT_BRAND_SUBCATEGORY_CODE,
} from '~/features/wish-list/config/rexBridge';

export function canOfferAddToWishList(
  rec: Pick<Recommendation, 'categoryId' | 'subcategoryCode'>,
): boolean {
  if (rec.subcategoryCode) return rec.subcategoryCode === PRODUCT_BRAND_SUBCATEGORY_CODE;
  return rec.categoryId === PRODUCT_BRAND_CATEGORY_CODE;
}
