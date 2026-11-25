import React, { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import ProfileView from '~/features/profile/ui/ProfileView';
import { Routes } from '~/shared/config/routes';
import { openRecommendation } from '~/shared/lib/navigation/createRex';
import { COLLECTION_FROM, openCollection } from '~/shared/lib/navigation/openCollection';
import { openRexRequest } from '~/shared/lib/navigation/rexRequest';
import { openUserWishList } from '~/shared/lib/navigation/wishList';
import { MY_PROFILES_QUERY_KEY_ROOT } from '~/shared/config/queryKeys';

export default function ProfileScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [avatarRefreshKey, setAvatarRefreshKey] = useState(0);

  const onAvatarUpdated = useCallback(() => {
    setAvatarRefreshKey((k) => k + 1);
    void queryClient.invalidateQueries({ queryKey: MY_PROFILES_QUERY_KEY_ROOT });
  }, [queryClient]);

  return (
    <ProfileView
      onAvatarUpdated={onAvatarUpdated}
      avatarRefreshKey={avatarRefreshKey}
      onRexPress={(rec) => openRecommendation(router, rec)}
      onEditProfile={() => router.push(Routes.ProfileEdit)}
      onOpenReferrals={() => router.push(Routes.Referrals)}
      onOpenCollection={(collectionId) =>
        openCollection(router, collectionId, COLLECTION_FROM.profile)
      }
      onOpenRexRequest={(requestId) => openRexRequest(router, requestId)}
      onOpenWishList={(userId) => openUserWishList(router, userId)}
    />
  );
}
