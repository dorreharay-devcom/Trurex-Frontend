import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SignedStorageImage } from '~/components/common/SignedStorageImage';
import { REX_IMAGES_BUCKET } from '~/constants/storageBuckets';
import { useAuth } from '~/services/AuthContext';
import { ProfileApi } from '~/api/ProfileApi';
import { Theme } from '~/theme/Theme';
import type { ProfileData } from '~/types/profile';
import { currentUser } from '~/data/mockData';
import { webContainerStyle } from '~/utils';
import {
  rexCoverRemoteHttpUrl,
  rexCoverStoragePathFromRecommendation,
} from '~/utils/recommendation/rexMediaPaths';
import ProfileHeader from './ProfileHeader';
import CurrentlySection from './CurrentlySection';
import EditProfile from './EditProfile';
import CollectionCard from './CollectionCard';
import { useMyCollections } from '~/hooks/useCollections';
import { useMyRexes } from '~/hooks/useDiscovery';

enum ProfileTab {
  Recs = 'recs',
  Collections = 'collections',
}

const TABS = [
  { id: ProfileTab.Recs, label: "Rex's" },
  { id: ProfileTab.Collections, label: 'Collections' },
];

interface ProfileViewProps {
  userId?: string;
  onAvatarUpdated?: () => void;
}

const ProfileView = ({ userId: propUserId, onAvatarUpdated }: ProfileViewProps) => {
  const { user: authUser, signOut } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>(ProfileTab.Recs);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const targetUserId = propUserId || authUser?.id;
  const { data: myRexes = [], isLoading: rexesLoading } = useMyRexes(targetUserId);
  const { data: myCollections = [], isLoading: collectionsLoading } = useMyCollections();

  const fetchProfile = useCallback(async () => {
    const targetUserId = propUserId || authUser?.id;

    if (!targetUserId) {
      setProfile(currentUser);
      setLoading(false);
      return;
    }
    try {
      const data = await ProfileApi.getProfile({ userId: targetUserId });
      setProfile(data);
    } catch (e) {
      console.error('[ProfileView] Failed to fetch profile:', e);
      setProfile({
        ...currentUser,
        rexCount: 0,
        followers: 142,
        following: 89,
      });
    } finally {
      setLoading(false);
    }
  }, [propUserId, authUser?.id]);

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

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={webContainerStyle}
      contentContainerClassName="p-4 pb-24"
    >
      <View className="bg-card border border-border rounded-xl shadow-card">
        {profile && (
          <ProfileHeader
            profile={profile}
            isOwnProfile={!propUserId || propUserId === authUser?.id}
            onEditProfile={() => setIsEditing(true)}
            onSignOut={signOut}
            onAvatarPress={handleAvatarPress}
            avatarUploading={avatarUploading}
          />
        )}

        {profile?.currently && <CurrentlySection currently={profile.currently} />}

        <View className="flex-row border-b border-border">
          {TABS.map((tab) => {
            const label = tab.id === ProfileTab.Recs ? `Rex's (${myRexes.length})` : tab.label;
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
              <View className="flex-row flex-wrap p-4 gap-3">
                {myRexes.map((rec) => (
                  <View
                    key={rec.id}
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
                      <Text className="text-[10px] text-accent font-medium">★ {rec.rating}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ))}

          {activeTab === ProfileTab.Collections &&
            (collectionsLoading ? (
              <View className="items-center py-8">
                <ActivityIndicator color={Theme.colors.primary} />
              </View>
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
                  <CollectionCard key={col.id} collection={col} />
                ))}
              </ScrollView>
            ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileView;
