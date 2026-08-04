import { useCallback, useState } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useAuth } from '~/features/auth/providers';
import { useMyCollections } from '~/features/collections/hooks/data/useCollectionQueries';
import { PROFILE_TAB, type ProfileTab } from '~/features/profile/config/tabs';
import { useMyRexes } from '~/features/profile/hooks/data/useMyRexes';
import { useProfileData } from '~/features/profile/hooks/data/useProfileData';
import { useProfileAvatarUpload } from '~/features/profile/hooks/useProfileAvatarUpload';
import { useProfileCollectionOverlay } from '~/features/profile/hooks/useProfileCollectionOverlay';
import { useProfileSocial } from '~/features/profile/hooks/useProfileSocial';
import type { Recommendation } from '~/shared/types/recommendation';

const SCROLL_LOAD_MORE_THRESHOLD_PX = 320;

type Params = {
  userId?: string;
  handle?: string;
  onAvatarUpdated?: () => void;
  onBack?: () => void;
  onRexPress?: (rec: Recommendation) => void;
};

export function useProfileScreen({
  userId: propUserId,
  handle: propHandle,
  onAvatarUpdated,
  onBack,
  onRexPress,
}: Params) {
  const { user: authUser, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>(PROFILE_TAB.recs);

  const profileData = useProfileData({
    propUserId,
    propHandle,
    authUserId: authUser?.id,
  });

  const rexes = useMyRexes(profileData.profileContentUserId);
  const collections = useMyCollections(profileData.profileContentUserId);
  const collectionsList = collections.data ?? [];

  const collectionOverlay = useProfileCollectionOverlay({ onRexPress });
  const avatar = useProfileAvatarUpload({
    userId: authUser?.id,
    onUploaded: profileData.fetchProfile,
    onAvatarUpdated,
  });
  const social = useProfileSocial({
    viewerId: authUser?.id,
    targetUserId: profileData.followTargetId,
    onRefresh: profileData.fetchProfile,
    onBlocked: onBack,
  });

  const loadMoreOnScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      const nearBottom =
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - SCROLL_LOAD_MORE_THRESHOLD_PX;
      if (!nearBottom) return;
      if (activeTab === PROFILE_TAB.recs) rexes.fetchNextPage();
      if (activeTab === PROFILE_TAB.collections) collections.fetchNextPage();
    },
    [activeTab, rexes.fetchNextPage, collections.fetchNextPage],
  );

  const closeEdit = useCallback(() => {
    setIsEditing(false);
    profileData.beginLoading();
    void profileData.fetchProfile();
    onAvatarUpdated?.();
  }, [profileData.beginLoading, profileData.fetchProfile, onAvatarUpdated]);

  return {
    isEditing,
    openEdit: () => setIsEditing(true),
    closeEdit,
    profile: profileData.profile,
    loading: profileData.loading,
    notFound: profileData.notFound,
    awaitingHandleProfile: profileData.awaitingHandleProfile,
    isOwnProfile: profileData.isOwnProfile,
    signOut,
    avatar,
    onRexPress,
    onBack,
    content: {
      activeTab,
      setActiveTab,
      myRexes: rexes.data ?? [],
      rexesLoading: rexes.isLoading,
      isFetchingNextRexesPage: rexes.isFetchingNextPage,
      myCollections: collectionsList,
      collectionsLoading: collections.isLoading,
      isFetchingNextCollectionsPage: collections.isFetchingNextPage,
      rexTabCount: rexes.data?.length ?? 0,
      collectionsTabCount: collectionsList[0]?.total_count ?? collectionsList.length,
      loadMoreOnScroll,
    },
    social,
    collectionOverlay,
  };
}
