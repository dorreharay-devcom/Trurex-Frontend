import { useCallback, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '~/features/auth/providers';
import { useMyCollections } from '~/features/collections/hooks/data/useCollectionQueries';
import {
  isProfileTab,
  parseProfileTabParam,
  type ProfileTab,
} from '~/features/profile/config/tabs';
import { useMyRexes } from '~/features/profile/hooks/data/useMyRexes';
import { useMyRexRequests } from '~/features/rex-requests/hooks/useMyRexRequests';
import { useProfileData } from '~/features/profile/hooks/data/useProfileData';
import { useProfileAvatarUpload } from '~/features/profile/hooks/useProfileAvatarUpload';
import { useProfileBusinessView } from '~/features/profile/hooks/useProfileBusinessView';
import { withBusinessFace } from '~/features/profile/lib/profileFace';
import { useProfileSocial } from '~/features/profile/hooks/useProfileSocial';
import { firstRouteParam } from '~/shared/lib/navigation/routeIds';
import { Routes } from '~/shared/config/routes';
import type { Recommendation } from '~/shared/types/recommendation';

type Params = {
  userId?: string;
  handle?: string;
  onAvatarUpdated?: () => void;
  onBack?: () => void;
  onRexPress?: (rec: Recommendation) => void;
  onEditProfile?: () => void;
  onOpenCollection?: (collectionId: string) => void;
  onOpenRexRequest?: (requestId: string) => void;
  onOpenReferrals?: () => void;
  onOpenWishList?: (userId: string) => void;
  asBusiness?: boolean;
};

export function useProfileScreen({
  userId: propUserId,
  handle: propHandle,
  onAvatarUpdated,
  onBack,
  onRexPress,
  onEditProfile,
  onOpenCollection,
  onOpenRexRequest,
  onOpenReferrals,
  onOpenWishList,
  asBusiness = false,
}: Params) {
  const router = useRouter();
  const rawParams = useLocalSearchParams<{ tab?: string | string[] }>();
  const { user: authUser, signOut } = useAuth();

  const activeTab = useMemo(
    () => parseProfileTabParam(firstRouteParam(rawParams.tab)),
    [rawParams.tab],
  );

  const setActiveTab = useCallback(
    (tab: ProfileTab) => {
      if (!isProfileTab(tab)) return;
      router.setParams({ tab });
    },
    [router],
  );

  const profileData = useProfileData({
    propUserId,
    propHandle,
    authUserId: authUser?.id,
  });

  const business = useProfileBusinessView({
    isOwnProfile: profileData.isOwnProfile,
    profileKind: profileData.profile?.accountKind ?? null,
    asBusiness,
  });
  const contentUserId = business.contentReady ? profileData.profileContentUserId : undefined;
  const contentFilter = business.postedAsBusinessFilter;
  const rexes = useMyRexes(contentUserId, contentFilter);
  const collections = useMyCollections(contentUserId, contentFilter);
  const rexRequests = useMyRexRequests(contentUserId, profileData.isOwnProfile, contentFilter);
  const contentPending = !business.contentReady;
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
  const {
    fetchNextPage: fetchNextRexRequestsPage,
    data: rexRequestsData,
    isLoading: rexRequestsLoading,
    isError: rexRequestsIsError,
    isFetchingNextPage: isFetchingNextRexRequestsPage,
    isFetchNextPageError: isFetchNextRexRequestsError,
    refetch: refetchRexRequests,
  } = rexRequests;
  const { beginLoading, fetchProfile } = profileData;

  const headerProfile = useMemo(
    () => profileData.profile && withBusinessFace(profileData.profile, business.businessFace),
    [profileData.profile, business.businessFace],
  );

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

  const loadMoreRexRequests = useCallback(() => {
    void fetchNextRexRequestsPage();
  }, [fetchNextRexRequestsPage]);

  const openEdit = useCallback(() => {
    onEditProfile?.();
  }, [onEditProfile]);

  const openReferrals = useCallback(() => {
    onOpenReferrals?.();
  }, [onOpenReferrals]);

  const openVerifyIdentity = useCallback(() => {
    router.push(Routes.VerifyIdentity);
  }, [router]);

  const openWishList = useCallback(() => {
    if (!profileData.profileContentUserId) return;
    onOpenWishList?.(profileData.profileContentUserId);
  }, [onOpenWishList, profileData.profileContentUserId]);

  const openCollection = useCallback(
    (collectionId: string) => {
      onOpenCollection?.(collectionId);
    },
    [onOpenCollection],
  );

  const openRexRequest = useCallback(
    (requestId: string) => {
      onOpenRexRequest?.(requestId);
    },
    [onOpenRexRequest],
  );

  return {
    openEdit,
    openReferrals,
    openVerifyIdentity,
    openWishList,
    profile: profileData.profile,
    headerProfile,
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
    openCollection,
    openRexRequest,
    content: {
      activeTab,
      setActiveTab,
      myRexes: rexesData ?? [],
      rexesLoading: rexesLoading || contentPending,
      rexesError: rexesIsError && (rexesData?.length ?? 0) === 0,
      isFetchingNextRexesPage,
      isFetchNextRexesError,
      myCollections: collectionsList,
      collectionsLoading: collectionsLoading || contentPending,
      collectionsError: collectionsIsError && collectionsList.length === 0,
      isFetchingNextCollectionsPage,
      isFetchNextCollectionsError,
      myRexRequests: rexRequestsData,
      rexRequestsLoading: rexRequestsLoading || contentPending,
      rexRequestsError: rexRequestsIsError && rexRequestsData.length === 0,
      isFetchingNextRexRequestsPage,
      isFetchNextRexRequestsError,
      rexTabCount: rexesData?.length ?? 0,
      collectionsTabCount: collectionsList[0]?.total_count ?? collectionsList.length,
      rexRequestsTabCount: rexRequestsData.length,
      loadMoreRexes,
      loadMoreCollections,
      loadMoreRexRequests,
      retryRexes: () => void refetchRexes(),
      retryCollections: () => void refetchCollections(),
      retryRexRequests: () => void refetchRexRequests(),
    },
    social,
    business,
  };
}
