import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, useWindowDimensions, Animated, Modal, Pressable, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Routes } from '~/constants/routes';
import * as ImagePicker from 'expo-image-picker';
import { SignedStorageImage } from '~/components/common/SignedStorageImage';
import { RexCoverThumbnail } from '~/components/common/RexCoverThumbnail';
import { RexPlaceholderHtml } from '~/components/common/RexPlaceholderHtml';
import { REX_IMAGES_BUCKET } from '~/constants/storageBuckets';
import { useAuth } from '~/services/AuthContext';
import { ProfileApi } from '~/api/ProfileApi';
import { Theme } from '~/theme/Theme';
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
import { useSavedRexes } from '~/hooks/useGems';
import { useMyRexes } from '~/hooks/useDiscovery';
import { ChevronLeft, Star, UserX } from 'lucide-react-native';
import CollectionDetailView from '~/components/faves/CollectionDetailView';
import { OverlayModal } from '~/components/common/OverlayModal';
import { ModalToastLayer } from '~/components/toast/ModalToastLayer';
import { useOverlaySheetPresentation } from '~/hooks/useOverlaySheetPresentation';
import { modalConfig } from '~/constants/recommendation/modalConfig';
import { useQueryClient } from '@tanstack/react-query';
import { preparePickerImageUriForUpload } from '~/utils/photos/storageUpload';

enum ProfileTab {
  Recs = 'recs',
  Collections = 'collections',
}

const TABS = [
  { id: ProfileTab.Recs, label: "Rex's" },
  { id: ProfileTab.Collections, label: 'Collections' },
];

const AnimatedRexCard: React.FC<{
  rec: Recommendation;
  index: number;
  width: number;
  onPress?: () => void;
}> = ({ rec, index, width, onPress }) => {
  const placeholderHtml = rec.rexPlaceholderHtml?.trim() || null;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

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
        {placeholderHtml ? (
          <View className="relative aspect-square w-full overflow-hidden bg-transparent">
            <RexPlaceholderHtml html={placeholderHtml} />
          </View>
        ) : (
          <SignedStorageImage
            bucket={REX_IMAGES_BUCKET}
            storagePath={rexCoverStoragePathFromRecommendation(rec)}
            remoteUri={rexCoverRemoteHttpUrl(rec)}
            className="aspect-square w-full"
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
          {rec.rating != null && rec.rating > 0 ? (
            <View className="mt-1 flex-row items-center gap-1">
              <Star size={10} color={Theme.colors.ratingStar} fill={Theme.colors.ratingStar} />
              <Text className="text-[10px] font-medium text-rating-star">
                {rec.rating % 1 === 0 ? String(rec.rating) : rec.rating.toFixed(1)}
              </Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

interface ProfileViewProps {
  userId?: string;
  handle?: string;
  onAvatarUpdated?: () => void;
  onBack?: () => void;
  onRexPress?: (rec: Recommendation) => void;
  onSignUp?: () => void;
}

const ProfileView = ({ userId: propUserId, handle: propHandle, onAvatarUpdated, onBack, onRexPress, onSignUp }: ProfileViewProps) => {
  const { user: authUser, signOut } = useAuth();
  const router = useRouter();
  const isGuest = !authUser;

  const handleGuestAction = useCallback(() => {
    Alert.alert(
      'Sign up to continue',
      'Create an account to follow users and unlock all features.',
      [
        { text: 'Later', style: 'cancel' },
        { text: 'Sign in / Sign up', onPress: () => onSignUp ? onSignUp() : router.navigate(Routes.Login) },
      ],
    );
  }, [router, onSignUp]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>(ProfileTab.Recs);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [openCollectionId, setOpenCollectionId] = useState<string | null>(null);
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const { layout } = modalConfig;
  const { sheetTranslateY, handleClose: handleCollectionClose } = useOverlaySheetPresentation({
    visible: openCollectionId != null,
    windowHeight,
    onClose: () => setOpenCollectionId(null),
  });

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
    profile?.userId ??
    (viewingByUserId ? propUserId : viewingByHandle ? undefined : authUser?.id);

  const { data: myRexes = [], isLoading: rexesLoading } = useMyRexes(profileContentUserId);
  const { data: myCollections = [], isLoading: collectionsLoading } =
    useMyCollections(profileContentUserId);
  const { data: savedRexes = [] } = useSavedRexes();
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

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setProfile(null);
  }, [propUserId, propHandle]);

  const handleAvatarPress = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Allow photo access to change your avatar.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;
    if (!authUser?.id) return;
    try {
      setAvatarUploading(true);
      const prepared = await preparePickerImageUriForUpload(
        result.assets[0].uri,
        result.assets[0].fileName,
      );
      try {
        await ProfileApi.uploadAvatar(authUser.id, prepared.uri);
      } finally {
        prepared.dispose?.();
      }
      await fetchProfile();
      onAvatarUpdated?.();
    } catch {
      Alert.alert('Upload failed', 'Could not update avatar. Please try again.');
    } finally {
      setAvatarUploading(false);
    }
  }, [authUser?.id, fetchProfile]);

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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={webContainerStyle}
        contentContainerClassName="p-4 pb-24"
      >
        <EditProfile
          onClose={() => {
            setIsEditing(false);
            setLoading(true);
            fetchProfile();
          }}
        />
      </ScrollView>
    );
  }

  const rexTabCount = myRexes.length;

  return (
    <>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={webContainerStyle}
        contentContainerClassName="p-4"
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
              onFollow={() => follow.mutate()}
              onUnfollow={() => unfollow.mutate()}
              onGuestAction={handleGuestAction}
              followLoading={follow.isPending || unfollow.isPending}
            />
          )}

          {profile?.currently && <CurrentlySection currently={profile.currently} />}

          <View className="flex-row border-b border-border">
            {TABS.map((tab) => {
              const label =
                tab.id === ProfileTab.Recs
                  ? `Rex's (${rexTabCount})`
                  : tab.id === ProfileTab.Collections
                    ? `Collections (${myCollections.length})`
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
                  {(() => {
                    const gw = Math.min(windowWidth, 1280) - 66;
                    const numCols = gw < 700 ? 2 : 4;
                    const cw = Math.floor((gw - 12 * (numCols - 1)) / numCols);
                    return (
                      <View className="flex-row flex-wrap" style={{ gap: 12 }}>
                        {myRexes.map((rec, i) => (
                          <AnimatedRexCard
                            key={rec.id}
                            rec={rec}
                            index={i}
                            width={cw}
                            onPress={() => onRexPress?.(rec)}
                          />
                        ))}
                      </View>
                    );
                  })()}
                </View>
              ))}

            {activeTab === ProfileTab.Collections &&
              (collectionsLoading ? (
                <ProfileCollectionsSkeleton />
              ) : myCollections.length === 0 ? (
                <Text className="text-sm text-muted-foreground text-center py-8">
                  No collections yet
                </Text>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="gap-3 px-4 py-4"
                >
                  {myCollections.map((col) => (
                    <CollectionCard
                      key={col.id}
                      collection={col}
                      width={140}
                      onPress={() => setOpenCollectionId(col.id)}
                    />
                  ))}
                </ScrollView>
              ))}
          </View>
        </View>
      </ScrollView>

      {isGuest && (
        <View className="absolute bottom-0 left-0 right-0 border-t border-border bg-card">
          <View style={webContainerStyle} className="flex-row items-center justify-between px-4 py-3">
            <Text className="text-xs text-muted-foreground flex-1 mr-3">
              You have limited access. Sign up to see everything.
            </Text>
            <TouchableOpacity
              onPress={() => onSignUp ? onSignUp() : router.replace('/')}
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
        onRequestClose={handleCollectionClose}
        contentTranslateY={sheetTranslateY}
        backdropBackground={layout.backdropBackground}
      >
        {openCollectionId && (
          <CollectionDetailView
            collectionId={openCollectionId}
            onBack={handleCollectionClose}
            onAddItem={(id) => setAddToCollectionId(id)}
          />
        )}
      </OverlayModal>

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
              style={{ maxHeight: 400 }}
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
              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                {savedRexes.length === 0 ? (
                  <Text className="text-sm text-muted-foreground text-center py-6">
                    No saved rexes
                  </Text>
                ) : (
                  <View
                    style={[
                      { paddingHorizontal: 16, paddingVertical: 8, gap: 4 },
                      webContainerStyle,
                    ]}
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
                  </View>
                )}
                <View className="h-4" />
              </ScrollView>
            </View>
          </Animated.View>
        </View>
        <ModalToastLayer />
      </Modal>
    </>
  );
};

export default ProfileView;