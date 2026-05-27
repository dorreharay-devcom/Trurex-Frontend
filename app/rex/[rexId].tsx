import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Header } from '~/components/layout/Header';
import { TabBar, type Tab } from '~/components/layout/TabBar';
import { RecommendationDetailModal } from '~/components/recommendation/RecommendationDetailModal';
import ProtectedRoute from '~/components/common/ProtectedRoute';
import { fetchRexDetail } from '~/api/rexDetailApi';
import { rexDetailRowToRecommendation } from '~/utils/recommendation/rexDetailToRecommendation';
import { Routes } from '~/constants/routes';
import { Theme } from '~/theme/Theme';

export default function RexDeepLinkPage() {
  return (
    <ProtectedRoute>
      <RexDeepLinkContent />
    </ProtectedRoute>
  );
}

function RexDeepLinkContent() {
  const raw = useLocalSearchParams<{ rexId: string | string[] }>();
  const rexId = Array.isArray(raw.rexId) ? raw.rexId[0] : raw.rexId;
  const router = useRouter();
  const [avatarRefreshKey] = useState(0);

  const handleTabChange = useCallback(
    (_tab: Tab) => {
      router.replace(Routes.Main);
    },
    [router],
  );

  const closeToDiscover = useCallback(() => {
    router.replace(Routes.Main);
  }, [router]);

  const onAuthorPress = useCallback(
    (authorId: string) => {
      router.replace(`/user/${authorId}`);
    },
    [router],
  );

  const onUserPress = useCallback(
    (userId: string) => {
      router.replace(`/user/${userId}`);
    },
    [router],
  );

  const trimmedId = rexId?.trim() ?? '';

  const { data, isPending, isError } = useQuery({
    queryKey: ['rexDetail', trimmedId],
    queryFn: () => fetchRexDetail(trimmedId),
    enabled: trimmedId.length > 0,
  });

  const recommendation = useMemo(
    () => (data ? rexDetailRowToRecommendation(data) : null),
    [data],
  );

  const shellBody = (body: React.ReactNode) => (
    <View className="flex-1 bg-background">
      <Header
        searchQuery=""
        onSearchChange={() => {}}
        onProfilePress={() => handleTabChange('profile')}
        onAddPress={() => {}}
        avatarRefreshKey={avatarRefreshKey}
        showSearch={false}
      />
      <TabBar currentTab="discover" onTabChange={handleTabChange} />
      {body}
    </View>
  );

  if (!trimmedId) {
    return (
      <SafeAreaProvider>
        {shellBody(
          <View className="flex-1 justify-center items-center px-6">
            <Text className="text-center text-foreground mb-4">Missing recommendation link.</Text>
            <Pressable onPress={closeToDiscover} className="py-2 px-4 bg-primary rounded-lg">
              <Text className="text-white font-semibold">Go to Discover</Text>
            </Pressable>
          </View>,
        )}
      </SafeAreaProvider>
    );
  }

  if (isPending) {
    return (
      <SafeAreaProvider>
        {shellBody(
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color={Theme.colors.primary} />
          </View>,
        )}
      </SafeAreaProvider>
    );
  }

  if (isError || recommendation == null) {
    return (
      <SafeAreaProvider>
        {shellBody(
          <View className="flex-1 justify-center items-center px-6">
            <Text className="text-center text-foreground mb-4">
              {isError ? "Couldn't open this recommendation." : 'Recommendation not found.'}
            </Text>
            <Pressable onPress={closeToDiscover} className="py-2 px-4 bg-primary rounded-lg">
              <Text className="text-white font-semibold">Go to Discover</Text>
            </Pressable>
          </View>,
        )}
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      {shellBody(<View className="flex-1" />)}
      <RecommendationDetailModal
        visible
        recommendation={recommendation}
        onClose={closeToDiscover}
        onAuthorPress={onAuthorPress}
        onUserPress={onUserPress}
      />
    </SafeAreaProvider>
  );
}
