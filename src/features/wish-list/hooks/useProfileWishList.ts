import { useQuery } from '@tanstack/react-query';
import { WishListApi } from '~/features/wish-list/api/wishListApi';

export const PROFILE_WISH_LIST_PREVIEW_LIMIT = 6;

type Args = {
  userId: string;
  isOwnProfile: boolean;
  enabled: boolean;
};

function profileWishListQueryKey(userId: string, isOwnProfile: boolean) {
  return ['wish-list', 'profile-preview', userId, isOwnProfile] as const;
}

export function useProfileWishList({ userId, isOwnProfile, enabled }: Args) {
  const { data, isLoading } = useQuery({
    queryKey: profileWishListQueryKey(userId, isOwnProfile),
    queryFn: () =>
      isOwnProfile
        ? WishListApi.getMyWishList({ limit: PROFILE_WISH_LIST_PREVIEW_LIMIT })
        : WishListApi.getUserWishList(userId, { limit: PROFILE_WISH_LIST_PREVIEW_LIMIT }),
    enabled: Boolean(enabled && userId),
  });

  return { items: data ?? [], isLoading };
}
