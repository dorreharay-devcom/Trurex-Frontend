import { Backend, unwrap } from '~/shared/api/client';
import { coerceStringList } from '~/shared/lib/data/guards';
import { throwRpcIfFailed } from '~/shared/lib/errors/restriction';
import type {
  AddToWishListParams,
  ProductBrandRexesParams,
  ProductBrandRexRow,
  UpdateWishListItemParams,
  WishListItemRow,
  WishListListParams,
} from '~/features/wish-list/api/types';

export const WishListApi = {
  addToWishList: async (params: AddToWishListParams): Promise<WishListItemRow> => {
    return unwrap(
      await Backend.rpc('add_to_wish_list', {
        p_brand_name: params.brandName,
        p_product_name: params.productName ?? null,
        p_size: params.size ?? null,
        p_colour: params.colour ?? null,
        p_note: params.note ?? null,
        p_tags: params.tags ?? [],
        p_photo_path: params.photoPath ?? null,
        p_source_rex_id: params.sourceRexId ?? null,
      }),
    );
  },

  updateWishListItem: async (params: UpdateWishListItemParams): Promise<WishListItemRow> => {
    return unwrap(
      await Backend.rpc('update_wish_list_item', {
        p_id: params.id,
        p_brand_name: params.brandName,
        p_product_name: params.productName,
        p_size: params.size,
        p_colour: params.colour,
        p_note: params.note,
        p_tags: params.tags,
        p_photo_path: params.photoPath,
      }),
    );
  },

  deleteWishListItem: async (id: string): Promise<void> => {
    throwRpcIfFailed(await Backend.rpc('delete_wish_list_item', { p_id: id }));
  },

  getMyWishList: async (params: WishListListParams = {}): Promise<WishListItemRow[]> => {
    const data = unwrap(
      await Backend.rpc('get_my_wish_list', {
        p_limit: params.limit ?? 20,
        p_offset: params.offset ?? 0,
      }),
    );
    return Array.isArray(data) ? (data as WishListItemRow[]) : [];
  },

  getUserWishList: async (
    userId: string,
    params: WishListListParams = {},
  ): Promise<WishListItemRow[]> => {
    const data = unwrap(
      await Backend.rpc('get_user_wish_list', {
        p_user_id: userId,
        p_limit: params.limit ?? 20,
        p_offset: params.offset ?? 0,
      }),
    );
    return Array.isArray(data) ? (data as WishListItemRow[]) : [];
  },

  getProductBrandRexes: async (
    params: ProductBrandRexesParams = {},
  ): Promise<ProductBrandRexRow[]> => {
    const data = unwrap(
      await Backend.rpc('get_product_brand_rexes', {
        p_search: params.search?.trim() || null,
        p_limit: params.limit ?? 20,
        p_offset: params.offset ?? 0,
      }),
    );
    if (!Array.isArray(data)) return [];
    return (data as ProductBrandRexRow[]).map((row) => ({
      ...row,
      photo_paths: coerceStringList(row.photo_paths),
    }));
  },
};
