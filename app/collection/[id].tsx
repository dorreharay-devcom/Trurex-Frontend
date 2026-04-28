import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CollectionDetailView from '~/components/faves/CollectionDetailView';
import { Header } from '~/components/layout/Header';
import { TabBar } from '~/components/layout/TabBar';

export default function CollectionPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <Header
        searchQuery=""
        onSearchChange={() => {}}
        onProfilePress={() => router.replace('/')}
        onAddPress={() => router.replace('/')}
      />
      <TabBar currentTab="faves" onTabChange={(tab) => router.replace(`/?tab=${tab}`)} />
      <View className="flex-1">
        <CollectionDetailView
          collectionId={id}
          onBack={() => router.canGoBack() ? router.back() : router.replace('/')}
          onAddItem={() => {}}
        />
      </View>
    </SafeAreaView>
  );
}
