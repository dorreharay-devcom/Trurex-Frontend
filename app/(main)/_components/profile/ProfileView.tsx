import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '~/services/AuthContext';
// import { ProfileApi } from '~/api/ProfileApi'; // stashed with api layer
import { Theme } from '~/theme/Theme';
import type { ProfileData } from '~/types/profile';
import { currentUser, collections, recommendations } from '~/data/mockData';
import { webContainerStyle } from '~/utils';
import ProfileHeader from './ProfileHeader';
import CurrentlySection from './CurrentlySection';
import EditProfile from './EditProfile';
import CollectionCard from './CollectionCard';


const ACTIVITY_ITEMS = [
  { emoji: '❤️', text: "Liked Mia's rec for Lilia", time: '2h ago' },
  { emoji: '💾', text: 'Saved Devoción to Cafés collection', time: '5h ago' },
  { emoji: '🤝', text: 'Started trusting Jake Rivers', time: '1d ago' },
  { emoji: '📝', text: 'Added Attaboy to Bars', time: '2d ago' },
];


enum ProfileTab {
  Recs = 'recs',
  Collections = 'collections',
  Activity = 'activity',
}

const TABS = [
  { id: ProfileTab.Recs, label: `Rex's (${recommendations.length})` },
  { id: ProfileTab.Collections, label: 'Collections' },
  { id: ProfileTab.Activity, label: 'Activity' },
];

const ProfileView = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>(ProfileTab.Recs);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(currentUser);
      setLoading(false);
      return;
    }
    setProfile({ ...currentUser, rexCount: recommendations.length, followers: 142, following: 89 });
    setLoading(false);
  }, [user]);

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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={webContainerStyle} contentContainerClassName="p-4 pb-24">
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
      contentContainerStyle={webContainerStyle} contentContainerClassName="p-4 pb-24"
    >
      <View className="bg-card border border-border rounded-xl shadow-card">

        {profile && (
          <ProfileHeader
            profile={profile}
            isOwnProfile
            onEditProfile={() => setIsEditing(true)}
          />
        )}

        {profile?.currently && <CurrentlySection currently={profile.currently} />}

        <View className="flex-row border-b border-border">
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              className="flex-1 py-3 items-center"
              activeOpacity={0.7}
            >
              <Text className={`text-xs font-medium ${activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                {tab.label}
              </Text>
              {activeTab === tab.id && (
                <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View className="pb-4">
          {activeTab === ProfileTab.Recs && (
            <View className="flex-row flex-wrap p-4 gap-3">
              {recommendations.map((rec) => (
                <View key={rec.id} className="w-[48%] sm:w-[31.5%] lg:w-[23.8%] rounded-xl overflow-hidden shadow-card bg-background border border-border">
                  <Image source={{ uri: rec.image }} className="w-full aspect-square" resizeMode="cover" />
                  <View className="p-2.5">
                    <Text className="text-xs font-semibold text-foreground" numberOfLines={1}>{rec.title}</Text>
                    <Text className="text-[11px] text-muted-foreground" numberOfLines={1}>{rec.location || rec.category}</Text>
                    <Text className="text-[10px] text-accent font-medium">★ {rec.rating}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {activeTab === ProfileTab.Collections && (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerClassName="p-4 gap-3"
            >
              {collections.map((col) => (
                <CollectionCard key={col.id} collection={col} />
              ))}
            </ScrollView>
          )}

          {activeTab === ProfileTab.Activity && (
            <View className="gap-3 p-4">
              {ACTIVITY_ITEMS.map((item, i) => (
                <View
                  key={i}
                  className="flex-row items-center gap-3 p-3 rounded-xl bg-background border border-border"
                >
                  <Text className="text-lg">{item.emoji}</Text>
                  <Text className="text-sm text-foreground flex-1">{item.text}</Text>
                  <Text className="text-xs text-muted-foreground">{item.time}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileView;
