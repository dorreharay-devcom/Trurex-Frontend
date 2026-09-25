import type { AddYourOwnRecSource } from '~/features/rex-create/lib/addYourOwn';
import type { WishListItemRow } from '~/features/wish-list/api/types';
import {
  PRODUCT_BRAND_CATEGORY_CODE,
  PRODUCT_BRAND_SUBCATEGORY_CODE,
  PRODUCT_NAME_QUESTION_CODE,
} from '~/features/wish-list/config/rexBridge';

export function buildAddYourOwnRecSourceFromWishListItem(
  item: WishListItemRow,
): AddYourOwnRecSource {
  return {
    placeName: item.brand_name,
    categoryCode: PRODUCT_BRAND_CATEGORY_CODE,
    subcategoryCode: PRODUCT_BRAND_SUBCATEGORY_CODE,
    questionAnswers: item.product_name ? { [PRODUCT_NAME_QUESTION_CODE]: item.product_name } : {},
    linkedPlaceId: null,
    isOnlinePlace: false,
    placeWebsiteUrl: null,
    placeCategoryLabel: 'Product or Brand',
    locationLine: null,
    latitude: null,
    longitude: null,
  };
}
