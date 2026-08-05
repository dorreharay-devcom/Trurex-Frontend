import { useCallback, useState } from 'react';
import { useAuth } from '~/features/auth/providers';
import { useMyCollections } from '~/features/collections/hooks/data/useCollectionQueries';
import { PROFILE_TAB, type ProfileTab } from '~/features/profile/config/tabs';
import { useMyRexes } from '~/features/profile/hooks/data/useMyRexes';
import { useProfileData } from '~/features/profile/hooks/data/useProfileData';
import { useProfileAvatarUpload } from '~/features/profile/hooks/useProfileAvatarUpload';
import { useProfileCollectionOverlay } from '~/features/profile/hooks/useProfileCollectionOverlay';
import { useProfileSocial } from '~/features/profile/hooks/useProfileSocial';
import type { Recommendation } from '~/shared/types/recommendation';

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
  const {
    fetchNextPage: fetchNextRexesPage,
    data: rexesData,
    isLoading: rexesLoading,
    isError: rexesIsError,
    isFetchingNextPage: isFetchingNextRexesPage,
    isFetchNextPageError: isFetchNextRexesError,
    refetch: refetchRexes,
  } = rexes;
  const {
    fetchNextPage: fetchNextCollectionsPage,
    data: collectionsData,
    isLoading: collectionsLoading,
    isError: collectionsIsError,
    isFetchingNextPage: isFetchingNextCollectionsPage,
    isFetchNextPageError: isFetchNextCollectionsError,
    refetch: refetchCollections,
  } = collections;
  const collectionsList = collectionsData ?? [];
  const { beginLoading, fetchProfile } = profileData;

  const collectionOverlay = useProfileCollectionOverlay({ onRexPress });
  const avatar = useProfileAvatarUpload({
    userId: authUser?.id,
    onUploaded: fetchProfile,
    onAvatarUpdated,
  });
  const social = useProfileSocial({
    viewerId: authUser?.id,
    targetUserId: profileData.followTargetId,
    onRefresh: fetchProfile,
    onBlocked: onBack,
  });

  const loadMoreRexes = useCallback(() => {
    void fetchNextRexesPage();
  }, [fetchNextRexesPage]);

  const loadMoreCollections = useCallback(() => {
    void fetchNextCollectionsPage();
  }, [fetchNextCollectionsPage]);

  const closeEdit = useCallback(() => {
    setIsEditing(false);
    beginLoading();
    void fetchProfile();
    onAvatarUpdated?.();
  }, [beginLoading, fetchProfile, onAvatarUpdated]);

  return {
    isEditing,
    openEdit: () => setIsEditing(true),
    closeEdit,
    profile: profileData.profile,
    loading: profileData.loading,
    notFound: profileData.notFound,
    isError: profileData.isError,
    retryProfile: () => {
      beginLoading();
      void fetchProfile();
    },
    awaitingHandleProfile: profileData.awaitingHandleProfile,
    isOwnProfile: profileData.isOwnProfile,
    signOut,
    avatar,
    onRexPress,
    onBack,
    content: {
      activeTab,
      setActiveTab,
      myRexes: rexesData ?? [],
      rexesLoading,
      rexesError: rexesIsError && (rexesData?.length ?? 0) === 0,
      isFetchingNextRexesPage,
      isFetchNextRexesError,
      myCollections: collectionsList,
      collectionsLoading,
      collectionsError: collectionsIsError && collectionsList.length === 0,
      isFetchingNextCollectionsPage,
      isFetchNextCollectionsError,
      rexTabCount: rexesData?.length ?? 0,
      collectionsTabCount: collectionsList[0]?.total_count ?? collectionsList.length,
      loadMoreRexes,
      loadMoreCollections,
      retryRexes: () => void refetchRexes(),
      retryCollections: () => void refetchCollections(),
    },
    social,
    collectionOverlay,
  };
}
