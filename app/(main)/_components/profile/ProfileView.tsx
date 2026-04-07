import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '~/services/AuthContext';
// import { ProfileApi } from '~/api/ProfileApi'; // stashed with api layer
import { Theme } from '~/theme/Theme';
import type { ProfileData } from '~/types/profile';
import { currentUser } from '~/data/mockData';
import { webContainerStyle } from '~/utils';
import ProfileHeader from './ProfileHeader';
import CurrentlySection from './CurrentlySection';
import EditProfile from './EditProfile';

const MOCK_RECS = [
  {
    id: '1',
    title: 'Nobu Malibu',
    image:
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    location: 'Malibu, CA',
    category: 'Restaurants',
    rating: 4.9,
  },
  {
    id: '2',
    title: 'Alfred Coffee',
    image:
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    location: 'Los Angeles, CA',
    category: 'Cafes',
    rating: 4.7,
  },
  {
    id: '3',
    title: 'Chateau Marmont',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    location: 'West Hollywood, CA',
    category: 'Hotels',
    rating: 4.5,
  },
  {
    id: '4',
    title: 'Attaboy',
    image:
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80',
    location: 'New York, NY',
    category: 'Bars',
    rating: 4.8,
  },
];

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
  { id: ProfileTab.Recs, label: `Rex's (${MOCK_RECS.length})` },
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
    setProfile({ ...currentUser, rexCount: MOCK_RECS.length, followers: 142, following: 89 });
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
          <ProfileHeader profile={profile} isOwnProfile onEditProfile={() => setIsEditing(true)} />
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
              <Text
                className={`text-xs font-medium ${activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground'}`}
              >
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
            <View className="flex-row flex-wrap px-3 pt-3 pb-1">
              {MOCK_RECS.map((rec) => (
                <View key={rec.id} className="w-1/4 p-1">
                  <View className="rounded-xl overflow-hidden bg-background border border-border shadow-card">
                    <Image
                      source={{ uri: rec.image }}
                      className="w-full aspect-square"
                      resizeMode="cover"
                    />
                    <View className="p-2.5">
                      <Text className="text-xs font-semibold text-foreground" numberOfLines={1}>
                        {rec.title}
                      </Text>
                      <Text className="text-[11px] text-muted-foreground" numberOfLines={1}>
                        {rec.location || rec.category}
                      </Text>
                      <Text className="text-[10px] text-accent-foreground font-medium">
                        ★ {rec.rating}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {activeTab === ProfileTab.Collections && (
            <View className="p-4 items-center">
              <Text className="text-sm text-muted-foreground py-8">No collections yet</Text>
            </View>
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
