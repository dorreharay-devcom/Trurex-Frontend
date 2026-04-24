import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileView from '~/components/profile/ProfileView';

export default function UserProfilePage() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        <ProfileView
          userId={userId}
          onBack={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        />
      </View>
    </SafeAreaView>
  );
}
