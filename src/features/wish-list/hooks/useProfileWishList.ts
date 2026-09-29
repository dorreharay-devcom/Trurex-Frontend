import { useQuery } from '@tanstack/react-query';
import { WishListApi } from '~/features/wish-list/api/wishListApi';
import { WISH_LIST_QUERY_KEYS } from '~/features/wish-list/config/queryKeys';

export const PROFILE_WISH_LIST_PREVIEW_LIMIT = 6;

type Args = {
  userId: string;
  isOwnProfile: boolean;
  enabled: boolean;
};

export function useProfileWishList({ userId, isOwnProfile, enabled }: Args) {
  const { data, isLoading } = useQuery({
    queryKey: WISH_LIST_QUERY_KEYS.profilePreview(userId, isOwnProfile),
    queryFn: () =>
      isOwnProfile
        ? WishListApi.getMyWishList({ limit: PROFILE_WISH_LIST_PREVIEW_LIMIT })
        : WishListApi.getUserWishList(userId, { limit: PROFILE_WISH_LIST_PREVIEW_LIMIT }),
    enabled: Boolean(enabled && userId),
  });

  return { items: data ?? [], isLoading };
}
