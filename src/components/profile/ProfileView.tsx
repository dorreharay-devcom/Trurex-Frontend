import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, useWindowDimensions, Animated, Modal, Pressable, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Routes } from '~/constants/routes';
import * as ImagePicker from 'expo-image-picker';
import { SignedStorageImage } from '~/components/common/SignedStorageImage';
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
import { useMyCollections, useAddRexToCollection } from '~/hooks/useCollections';
import { useFollowUser } from '~/hooks/useFollowUser';
import { useSavedRexes } from '~/hooks/useGems';
import { useMyRexes } from '~/hooks/useDiscovery';
import { ChevronLeft, UserX } from 'lucide-react-native';
import CollectionDetailView from '~/components/faves/CollectionDetailView';
import { OverlayModal } from '~/components/common/OverlayModal';
import { useOverlaySheetPresentation } from '~/hooks/useOverlaySheetPresentation';
import { modalConfig } from '~/constants/recommendation/modalConfig';
import { useQueryClient } from '@tanstack/react-query';

enum ProfileTab {
  Recs = 'recs',
  Collections = 'collections',
}

const TABS = [
  { id: ProfileTab.Recs, label: "Rex's" },
  { id: ProfileTab.Collections, label: 'Collections' },
];

const CollectionSkeleton: React.FC = () => {
  const opacity = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);
  return (
    <View className="flex-row gap-3 px-4 py-4">
      {[1, 2, 3].map((i) => (
        <Animated.View
          key={i}
          style={{ opacity, width: 176, height: 224 }}
          className="rounded-xl bg-muted"
        />
      ))}
    </View>
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
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>(ProfileTab.Recs);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [openCollectionId, setOpenCollectionId] = useState<string | null>(null);
  const { height: windowHeight } = useWindowDimensions();
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

  const targetUserId = propUserId || authUser?.id;
  const isOwnProfile = !propUserId || propUserId === authUser?.id;
  const { data: myRexes = [], isLoading: rexesLoading } = useMyRexes(targetUserId);
  const { data: myCollections = [], isLoading: collectionsLoading } = useMyCollections(targetUserId);
  const { data: savedRexes = [] } = useSavedRexes();
  const { mutate: addRex } = useAddRexToCollection();

  useEffect(() => {
    if (addToCollectionId) {
      setAddSheetVisible(true);
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(addSheetTranslateY, { toValue: 0, damping: 20, stiffness: 200, useNativeDriver: true }),
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

  const { follow, unfollow } = useFollowUser(propUserId ?? '', fetchProfile);

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
      await ProfileApi.uploadAvatar(authUser.id, result.assets[0].uri);
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

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color={Theme.colors.primary} />
      </View>
    );
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
        contentContainerClassName="p-4 pb-24"
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
                <View className="items-center py-8">
                  <ActivityIndicator color={Theme.colors.primary} />
                </View>
              ) : myRexes.length === 0 ? (
                <Text className="text-sm text-muted-foreground text-center py-8">No rexes yet</Text>
              ) : (
                <View className="p-4">
                  <Text className="text-xs font-medium text-muted-foreground mb-3">
                    {myRexes.length} {myRexes.length === 1 ? 'Rex' : 'Rexes'}
                  </Text>
                  <View className="flex-row flex-wrap gap-3">
                    {myRexes.map((rec) => (
                      <TouchableOpacity
                        key={rec.id}
                        activeOpacity={0.8}
                        onPress={() => onRexPress?.(rec)}
                        className="w-[22%] rounded-xl overflow-hidden shadow-card bg-background border border-border"
                      >
                        <SignedStorageImage
                          bucket={REX_IMAGES_BUCKET}
                          storagePath={rexCoverStoragePathFromRecommendation(rec)}
                          remoteUri={rexCoverRemoteHttpUrl(rec)}
                          className="aspect-square w-full"
                          accessibilityLabel={rec.title}
                        />
                        <View className="p-2.5">
                          <Text className="text-xs font-semibold text-foreground" numberOfLines={1}>
                            {rec.title}
                          </Text>
                          <Text className="text-[11px] text-muted-foreground" numberOfLines={1}>
                            {rec.location || rec.category}
                          </Text>
                          <Text className="text-[10px] font-medium" style={{ color: '#f97316' }}>
                            ★ {rec.rating}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}

            {activeTab === ProfileTab.Collections &&
              (collectionsLoading ? (
                <CollectionSkeleton />
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
          style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)', opacity: backdropOpacity }]}
          pointerEvents="box-none"
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setAddToCollectionId(null)} />
        </Animated.View>

        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }} pointerEvents="box-none">
          <Animated.View style={{ width: '100%', transform: [{ translateY: addSheetTranslateY }] }}>
            <View className="bg-card rounded-t-2xl border-t border-border" style={{ maxHeight: 400 }}>
              <View style={webContainerStyle} className="items-center py-3">
                <View className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </View>
              <View style={[{ paddingHorizontal: 16, paddingBottom: 12 }, webContainerStyle]}>
                <Text className="text-base font-display font-medium text-foreground">Pick a saved rex</Text>
              </View>
              <View className="h-px bg-border mb-1" />
              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                {savedRexes.length === 0 ? (
                  <Text className="text-sm text-muted-foreground text-center py-6">No saved rexes</Text>
                ) : (
                  <View style={[{ paddingHorizontal: 16, paddingVertical: 8, gap: 4 }, webContainerStyle]}>
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
                                queryClient.invalidateQueries({ queryKey: ['collection-detail', openCollectionId] });
                              },
                            },
                          );
                        }}
                        className="flex-row items-center gap-3 p-3 rounded-xl"
                      >
                        <View className="w-10 h-10 rounded-lg overflow-hidden bg-muted">
                          <SignedStorageImage
                            bucket={REX_IMAGES_BUCKET}
                            storagePath={rexCoverStoragePathFromRecommendation(rec)}
                            remoteUri={rexCoverRemoteHttpUrl(rec)}
                            className="w-full h-full"
                            accessibilityLabel={rec.title}
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>{rec.title}</Text>
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
      </Modal>
    </>
  );
};

export default ProfileView;
