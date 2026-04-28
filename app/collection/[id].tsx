import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CollectionDetailView from '~/components/faves/CollectionDetailView';

export default function CollectionPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        <CollectionDetailView
          collectionId={id}
          onBack={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          onAddItem={() => {}}
        />
      </View>
    </SafeAreaView>
  );
}
