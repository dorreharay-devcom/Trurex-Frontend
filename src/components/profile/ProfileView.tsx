import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  useWindowDimensions,
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Platform,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Routes } from '~/shared/config/routes';
import * as ImagePicker from 'expo-image-picker';
import { SignedStorageImage } from '~/components/common/SignedStorageImage';
import { RexCoverThumbnail } from '~/components/common/RexCoverThumbnail';
import { RexPhotoPlaceholder } from '~/components/common/RexPhotoPlaceholder';
import { REX_IMAGES_BUCKET } from '~/constants/storageBuckets';
import { useAuth } from '~/features/auth/providers';
import { ProfileApi } from '~/api/ProfileApi';
import { Theme } from '~/shared/theme/Theme';
import type { ProfileData } from '~/types/profile';
import type { Recommendation } from '~/types/recommendation/recommendation';
import { webContainerStyle } from '~/utils';
import {
  rexCoverRemoteHttpUrl,
  rexCoverStoragePathFromRecommendation,
} from '~/utils/recommendation/recContentDisplay';
import ProfileHeader from './ProfileHeader';
import CurrentlySection from './CurrentlySection';
import EditProfile from './EditProfile';
import CollectionCard from './CollectionCard';
import {
  ProfileCardSkeleton,
  ProfileCollectionsSkeleton,
  ProfileRexGridSkeleton,
} from './skeleton';
import { useMyCollections, useAddRexToCollection } from '~/hooks/useCollections';
import { useFollowUser } from '~/hooks/useFollowUser';
import { useBlockUser } from '~/hooks/useBlockUser';
import { useSavedRexes } from '~/hooks/useGems';
import { useMyRexes } from '~/hooks/useDiscovery';
import { ChevronLeft, Star, UserX } from 'lucide-react-native';
import CollectionDetailView from '~/components/faves/CollectionDetailView';
import { OverlayModal } from '~/components/common/OverlayModal';
import { DestructiveActionConfirmModal } from '~/components/common/DestructiveActionConfirmModal';
import { ModalToastLayer } from '~/components/toast/ModalToastLayer';
import { useOverlaySheetPresentation } from '~/hooks/useOverlaySheetPresentation';
import { modalConfig } from '~/constants/recommendation/modalConfig';
import { useQueryClient } from '@tanstack/react-query';
import { pickLibraryImages } from '~/utils/photos/imagePickerLaunch';
import { photoUploadErrorMessage } from '~/utils/photos/storageUpload';
import { toastError } from '~/utils/appToast';
import { ConnectionLoadMoreButton } from '~/components/circles/common';

const COLLECTION_REX_OPEN_DELAY_MS = 120;

enum ProfileTab {
  Recs = 'recs',
  Collections = 'collections',
}

const TABS = [
  { id: ProfileTab.Recs, label: 'Rex' },
  { id: ProfileTab.Collections, label: 'Collections' },
];

const AnimatedRexCard: React.FC<{
  rec: Recommendation;
  index: number;
  width: number;
  onPress?: () => void;
}> = ({ rec, index, width, onPress }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;
  const coverPath = rexCoverStoragePathFromRecommendation(rec);
  const coverHttp = rexCoverRemoteHttpUrl(rec);
  const hasCoverImage = Boolean(coverPath || coverHttp);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 250,
        delay: index * 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ width, opacity, transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        className="rounded-xl overflow-hidden shadow-card bg-background border border-border"
      >
        {hasCoverImage ? (
          <SignedStorageImage
            bucket={REX_IMAGES_BUCKET}
            storagePath={coverPath}
            remoteUri={coverHttp}
            className="aspect-square w-full"
            accessibilityLabel={rec.title}
          />
        ) : (
          <RexPhotoPlaceholder
            categoryIcon={rec.categoryIcon}
            colors={rec.placeholderColors}
            className="aspect-square w-full"
            emojiSize={40}
            accessibilityLabel={rec.title}
          />
        )}
        <View className="p-2.5">
          <Text className="text-xs font-semibold text-foreground" numberOfLines={1}>
            {rec.title}
          </Text>
          <Text className="text-[11px] text-muted-foreground" numberOfLines={1}>
            {rec.location || rec.category}
          </Text>
          <View className="mt-1 h-4 flex-row items-center gap-1">
            {rec.rating != null && rec.rating > 0 ? (
              <>
                <Star size={10} color={Theme.colors.ratingStar} fill={Theme.colors.ratingStar} />
                <Text className="text-[10px] font-medium text-rating-star">
                  {rec.rating % 1 === 0 ? String(rec.rating) : rec.rating.toFixed(1)}
                </Text>
              </>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

interface ProfileViewProps {
  userId?: string;
  handle?: string;
  onAvatarUpdated?: () => void;
  avatarRefreshKey?: number;
  onBack?: () => void;
  onRexPress?: (rec: Recommendation) => void;
  onSignUp?: () => void;
}

const ProfileView = ({
  userId: propUserId,
  handle: propHandle,
  onAvatarUpdated,
  avatarRefreshKey = 0,
  onBack,
  onRexPress,
  onSignUp,
}: ProfileViewProps) => {
  const { user: authUser, signOut } = useAuth();
  const router = useRouter();
  const isGuest = !authUser;

  const handleGuestAction = useCallback(() => {
    Alert.alert(
      'Sign up to continue',
      'Create an account to follow users and unlock all features.',
      [
        { text: 'Later', style: 'cancel' },
        {
          text: 'Sign in / Sign up',
          onPress: () => (onSignUp ? onSignUp() : router.navigate(Routes.Login)),
        },
      ],
    );
  }, [router, onSignUp]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>(ProfileTab.Recs);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [openCollectionId, setOpenCollectionId] = useState<string | null>(null);
  const [pendingCollectionRex, setPendingCollectionRex] = useState<Recommendation | null>(null);
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const { layout } = modalConfig;
  const { sheetTranslateY, handleClose: handleCollectionClose } = useOverlaySheetPresentation({
    visible: openCollectionId != null,
    windowHeight,
    onClose: () => setOpenCollectionId(null),
  });
  const closeCollection = useCallback(() => {
    if (Platform.OS === 'web') {
      handleCollectionClose();
      return;
    }
    setOpenCollectionId(null);
  }, [handleCollectionClose]);

  const handleCollectionRexPress = useCallback(
    (rec: Recommendation) => {
      if (Platform.OS !== 'web') {
        setOpenCollectionId(null);
        onRexPress?.(rec);
        return;
      }
      setPendingCollectionRex(rec);
      handleCollectionClose();
    },
    [handleCollectionClose, onRexPress],
  );

  useEffect(() => {
    if (pendingCollectionRex == null) return;
    const rec = pendingCollectionRex;
    const timeout = setTimeout(() => {
      setPendingCollectionRex(null);
      onRexPress?.(rec);
    }, COLLECTION_REX_OPEN_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [pendingCollectionRex, onRexPress]);

  const queryClient = useQueryClient();
  const [addToCollectionId, setAddToCollectionId] = useState<string | null>(null);
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const addSheetTranslateY = useRef(new Animated.Value(400)).current;
  const [addSheetVisible, setAddSheetVisible] = useState(false);

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const viewingByHandle = Boolean(propHandle);
  const viewingByUserId = Boolean(propUserId);

  const isOwnProfile =
    profile != null
      ? profile.userId === authUser?.id
      : viewingByUserId
        ? propUserId === authUser?.id
        : !viewingByHandle;

  const profileContentUserId =
    profile?.userId ?? (viewingByUserId ? propUserId : viewingByHandle ? undefined : authUser?.id);

  const {
    data: myRexes = [],
    isLoading: rexesLoading,
    isFetchingNextPage: isFetchingNextRexesPage,
    fetchNextPage: fetchNextRexesPage,
  } = useMyRexes(profileContentUserId);
  const {
    data: myCollections = [],
    isLoading: collectionsLoading,
    isFetchingNextPage: isFetchingNextCollectionsPage,
    fetchNextPage: fetchNextCollectionsPage,
  } = useMyCollections(profileContentUserId);
  const {
    data: savedRexes = [],
    hasNextPage: hasNextSavedRexesPage,
    isFetchingNextPage: isFetchingNextSavedRexesPage,
    fetchNextPage: fetchNextSavedRexesPage,
  } = useSavedRexes();
  const { mutate: addRex } = useAddRexToCollection();

  useEffect(() => {
    if (addToCollectionId) {
      setAddSheetVisible(true);
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(addSheetTranslateY, {
          toValue: 0,
          damping: 20,
          stiffness: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(addSheetTranslateY, { toValue: 400, duration: 220, useNativeDriver: true }),
      ]).start(() => setAddSheetVisible(false));
    }
  }, [addToCollectionId]);

  const fetchProfile = useCallback(async () => {
    const targetId = propUserId || authUser?.id;
    if (!targetId && !propHandle) {
      setLoading(false);
      return;
    }
    try {
      const data = await ProfileApi.getProfile(
        propHandle ? { handle: propHandle } : { userId: targetId },
      );
      if (!data.userId) {
        setNotFound(true);
      } else {
        setProfile(data);
      }
    } catch (e) {
      console.error('[ProfileView] Failed to fetch profile:', e);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [propUserId, propHandle, authUser?.id]);

  const followTargetId = profile?.userId ?? propUserId ?? '';
  const { follow, unfollow } = useFollowUser(followTargetId, fetchProfile);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const {
    isBlocked,
    block,
    unblock,
    isPending: blockPending,
  } = useBlockUser({
    viewerId: authUser?.id,
    targetUserId: followTargetId,
    onBlocked: () => {
      setShowBlockConfirm(false);
      onBack?.();
    },
  });

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setProfile(null);
    setShowBlockConfirm(false);
  }, [propUserId, propHandle]);

  const loadMoreOnScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      const nearBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 320;
      if (!nearBottom) return;
      if (activeTab === ProfileTab.Recs) fetchNextRexesPage();
      else if (activeTab === ProfileTab.Collections) fetchNextCollectionsPage();
    },
    [activeTab, fetchNextRexesPage, fetchNextCollectionsPage],
  );

  const handleAvatarPress = useCallback(async () => {
    if (!authUser?.id) return;

    if (Platform.OS !== 'web') {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission required', 'Allow photo access to change your avatar.');
        return;
      }
    }

    try {
      const assets = await pickLibraryImages(1);
      const asset = assets[0];
      if (!asset) return;

      try {
        setAvatarUploading(true);
        await ProfileApi.uploadAvatar(
          authUser.id,
          asset.uri,
          asset.fileName ?? `avatar-${Date.now()}.jpg`,
          asset.mimeType,
        );
        await fetchProfile();
        onAvatarUpdated?.();
      } finally {
        asset.dispose?.();
        setAvatarUploading(false);
      }
    } catch (e) {
      toastError('Photo unavailable', photoUploadErrorMessage(e));
    }
  }, [authUser?.id, fetchProfile, onAvatarUpdated]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const awaitingHandleProfile = viewingByHandle && profile == null && !notFound;

  if (loading || awaitingHandleProfile) {
    return <ProfileCardSkeleton windowWidth={windowWidth} showBack={!!onBack} />;
  }

  if (notFound) {
    return (
      <View className="flex-1 items-center justify-center gap-3 px-8">
        {onBack && (
          <TouchableOpacity
            onPress={onBack}
            className="absolute left-4 top-4 flex-row items-center gap-1"
            activeOpacity={0.7}
          >
            <ChevronLeft size={20} color={Theme.colors.foreground} />
            <Text className="text-sm font-medium text-foreground">Back</Text>
          </TouchableOpacity>
        )}
        <UserX size={48} color={Theme.colors.secondaryText} />
        <Text className="text-lg font-semibold text-foreground">User not found</Text>
        <Text className="text-center text-sm text-muted-foreground">
          This profile doesn't exist or may have been removed.
        </Text>
      </View>
    );
  }

  if (isEditing) {
    return (
      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios' ? 'padding' : Platform.OS === 'android' ? 'height' : undefined
        }
        className="min-h-0 flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          automaticallyAdjustKeyboardInsets
          contentContainerStyle={webContainerStyle}
          contentContainerClassName="p-4 pb-40"
        >
          <EditProfile
            onClose={() => {
              setIsEditing(false);
              setLoading(true);
              fetchProfile();
              onAvatarUpdated?.();
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  const rexTabCount = myRexes.length;
  const collectionsTabCount = myCollections[0]?.total_count ?? myCollections.length;
  const gridWidth = Math.min(windowWidth, 1280) - 66;
  const numCols = gridWidth < 700 ? 2 : 4;
  const cellWidth = Math.floor((gridWidth - 12 * (numCols - 1)) / numCols);
  const addToCollectionSheet = (
    <Modal
      visible={addSheetVisible}
      transparent
      animationType="none"
      presentationStyle={Platform.OS === 'ios' ? 'overFullScreen' : undefined}
      statusBarTranslucent={Platform.OS === 'android'}
      onRequestClose={() => setAddToCollectionId(null)}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: 'rgba(0,0,0,0.5)', opacity: backdropOpacity },
        ]}
        pointerEvents="box-none"
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setAddToCollectionId(null)} />
      </Animated.View>

      <View
        style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}
        pointerEvents="box-none"
      >
        <Animated.View style={{ width: '100%', transform: [{ translateY: addSheetTranslateY }] }}>
          <View
            className="w-full bg-card rounded-t-2xl border-t border-border"
            style={{ height: Math.min(400, windowHeight * 0.5), maxHeight: 400 }}
          >
            <View className="w-full items-center py-3">
              <View className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </View>
            <View className="w-full px-4 pb-3">
              <Text className="text-base font-display font-medium text-foreground">
                Pick a saved rex
              </Text>
            </View>
            <View className="h-px w-full bg-border mb-1" />
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              style={{ flex: 1 }}
            >
              {savedRexes.length === 0 ? (
                <Text className="text-sm text-muted-foreground text-center py-6">
                  No saved rexes
                </Text>
              ) : (
                <View
                  style={[{ paddingHorizontal: 16, paddingVertical: 8, gap: 4 }, webContainerStyle]}
                >
                  {savedRexes.map((rec) => (
                    <TouchableOpacity
                      key={rec.id}
                      activeOpacity={0.7}
                      onPress={() => {
                        if (!addToCollectionId) return;
                        addRex(
                          { collection_id: addToCollectionId, rex_id: rec.id },
                          {
                            onSuccess: () => {
                              setAddToCollectionId(null);
                              queryClient.invalidateQueries({
                                queryKey: ['collection-detail', openCollectionId],
                              });
                            },
                          },
                        );
                      }}
                      className="flex-row items-center gap-3 p-3 rounded-xl"
                    >
                      <RexCoverThumbnail rec={rec} className="h-10 w-10 rounded-lg" />
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
                          {rec.title}
                        </Text>
                        <Text className="text-xs text-muted-foreground">{rec.category}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                  <ConnectionLoadMoreButton
                    visible={hasNextSavedRexesPage}
                    loading={isFetchingNextSavedRexesPage}
                    onPress={fetchNextSavedRexesPage}
                  />
                </View>
              )}
              <View className="h-4" />
            </ScrollView>
          </View>
        </Animated.View>
      </View>
      <ModalToastLayer />
    </Modal>
  );

  if (openCollectionId && Platform.OS !== 'web') {
    return (
      <>
        <CollectionDetailView
          collectionId={openCollectionId}
          onBack={closeCollection}
          onAddItem={(id) => setAddToCollectionId(id)}
          onRecommendationPress={handleCollectionRexPress}
        />
        {addToCollectionSheet}
      </>
    );
  }

  return (
    <>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={webContainerStyle}
        contentContainerClassName="p-4"
        onScroll={loadMoreOnScroll}
        scrollEventThrottle={16}
      >
        {onBack && (
          <TouchableOpacity
            onPress={onBack}
            className="flex-row items-center gap-1 mb-3 self-start"
            activeOpacity={0.7}
          >
            <ChevronLeft size={20} color={Theme.colors.foreground} />
            <Text className="text-sm font-medium text-foreground">Back</Text>
          </TouchableOpacity>
        )}

        <View className="bg-card border border-border rounded-xl shadow-card">
          {profile && (
            <ProfileHeader
              profile={profile}
              isOwnProfile={isOwnProfile}
              isGuest={isGuest}
              onEditProfile={() => setIsEditing(true)}
              onSignOut={signOut}
              onAvatarPress={handleAvatarPress}
              avatarUploading={avatarUploading}
              avatarRefreshKey={avatarRefreshKey}
              onFollow={() => follow.mutate()}
              onUnfollow={() => unfollow.mutate()}
              onGuestAction={handleGuestAction}
              followLoading={follow.isPending || unfollow.isPending}
              isBlocked={isBlocked}
              onBlockPress={() => setShowBlockConfirm(true)}
              onUnblockPress={() => unblock.mutate()}
              blockLoading={blockPending}
            />
          )}

          {profile?.currently && <CurrentlySection currently={profile.currently} />}

          <View className="flex-row border-b border-border">
            {TABS.map((tab) => {
              const label =
                tab.id === ProfileTab.Recs
                  ? `Rex (${rexTabCount})`
                  : tab.id === ProfileTab.Collections
                    ? `Collections (${collectionsTabCount})`
                    : tab.label;
              return (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  className="flex-1 py-3 items-center"
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-xs font-medium ${activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground'}`}
                  >
                    {label}
                  </Text>
                  {activeTab === tab.id && (
                    <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <View className="pb-4">
            {activeTab === ProfileTab.Recs &&
              (rexesLoading ? (
                <View className="p-4">
                  <ProfileRexGridSkeleton windowWidth={windowWidth} />
                </View>
              ) : myRexes.length === 0 ? (
                <Text className="text-sm text-muted-foreground text-center py-8">No rexes yet</Text>
              ) : (
                <View className="p-4">
                  <View className="flex-row flex-wrap" style={{ gap: 12 }}>
                    {myRexes.map((rec, i) => (
                      <AnimatedRexCard
                        key={rec.id}
                        rec={rec}
                        index={i}
                        width={cellWidth}
                        onPress={() => onRexPress?.(rec)}
                      />
                    ))}
                  </View>
                  {isFetchingNextRexesPage && (
                    <View className="py-4 items-center">
                      <ActivityIndicator size="small" color={Theme.colors.primary} />
                    </View>
                  )}
                </View>
              ))}

            {activeTab === ProfileTab.Collections &&
              (collectionsLoading ? (
                <ProfileCollectionsSkeleton windowWidth={windowWidth} />
              ) : myCollections.length === 0 ? (
                <Text className="text-sm text-muted-foreground text-center py-8">
                  No collections yet
                </Text>
              ) : (
                <View className="p-4">
                  <View className="flex-row flex-wrap" style={{ gap: 12 }}>
                    {myCollections.map((col) => (
                      <CollectionCard
                        key={col.id}
                        collection={col}
                        width={cellWidth}
                        onPress={() => setOpenCollectionId(col.id)}
                      />
                    ))}
                  </View>
                  {isFetchingNextCollectionsPage && (
                    <View className="py-4 items-center">
                      <ActivityIndicator size="small" color={Theme.colors.primary} />
                    </View>
                  )}
                </View>
              ))}
          </View>
        </View>
      </ScrollView>

      {isGuest && (
        <View className="absolute bottom-0 left-0 right-0 border-t border-border bg-card">
          <View
            style={webContainerStyle}
            className="flex-row items-center justify-between px-4 py-3"
          >
            <Text className="text-xs text-muted-foreground flex-1 mr-3">
              You have limited access. Sign up to see everything.
            </Text>
            <TouchableOpacity
              onPress={() => (onSignUp ? onSignUp() : router.replace('/'))}
              activeOpacity={0.8}
              className="px-4 py-2 rounded-lg bg-primary"
            >
              <Text className="text-xs font-bold text-primary-foreground">Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <OverlayModal
        visible={openCollectionId != null}
        onRequestClose={closeCollection}
        contentTranslateY={sheetTranslateY}
        backdropBackground={layout.backdropBackground}
      >
        {openCollectionId && (
          <CollectionDetailView
            collectionId={openCollectionId}
            onBack={closeCollection}
            onAddItem={(id) => setAddToCollectionId(id)}
            onRecommendationPress={handleCollectionRexPress}
          />
        )}
      </OverlayModal>

      {addToCollectionSheet}

      <DestructiveActionConfirmModal
        visible={showBlockConfirm}
        title="Block this user?"
        message="They won't be able to see your profile activity from your side, and their content will be hidden from your feed. You can unblock them later."
        confirmLabel="Block"
        pending={block.isPending}
        icon={<UserX size={22} color={Theme.colors.destructive} />}
        onCancel={() => {
          if (!block.isPending) setShowBlockConfirm(false);
        }}
        onConfirm={() => block.mutate()}
      />
    </>
  );
};

export default ProfileView;
