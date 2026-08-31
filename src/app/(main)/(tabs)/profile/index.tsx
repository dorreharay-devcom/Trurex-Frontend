import React, { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import ProfileView from '~/features/profile/ui/ProfileView';
import { useAuth } from '~/features/auth/providers';
import { Routes } from '~/shared/config/routes';
import { openRecommendation } from '~/shared/lib/navigation/createRex';
import { COLLECTION_FROM, openCollection } from '~/shared/lib/navigation/openCollection';
import { openRexRequest } from '~/shared/lib/navigation/rexRequest';
import { shellAvatarQueryKey } from '~/widgets/hooks/useHeaderAvatar';

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [avatarRefreshKey, setAvatarRefreshKey] = useState(0);

  const onAvatarUpdated = useCallback(() => {
    setAvatarRefreshKey((k) => k + 1);
    if (user?.id) {
      void queryClient.invalidateQueries({ queryKey: shellAvatarQueryKey(user.id) });
    }
  }, [queryClient, user?.id]);

  return (
    <ProfileView
      onAvatarUpdated={onAvatarUpdated}
      avatarRefreshKey={avatarRefreshKey}
      onRexPress={(rec) => openRecommendation(router, rec)}
      onEditProfile={() => router.push(Routes.ProfileEdit)}
      onOpenCollection={(collectionId) =>
        openCollection(router, collectionId, COLLECTION_FROM.profile)
      }
      onOpenRexRequest={(requestId) => openRexRequest(router, requestId)}
    />
  );
}
