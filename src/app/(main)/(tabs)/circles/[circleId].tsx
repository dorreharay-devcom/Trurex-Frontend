import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CircleDetailScreen from '~/features/circles/ui/detail/CircleDetailScreen';
import { Routes, toUserRoute } from '~/shared/config/routes';
import { parseOptionalRouteId } from '~/shared/lib/navigation/routeIds';

export default function CircleDetailRoute() {
  const router = useRouter();
  const { circleId: rawId } = useLocalSearchParams<{ circleId: string }>();
  const circleId = parseOptionalRouteId(rawId);

  const onBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(Routes.Circles);
  }, [router]);

  if (!circleId) {
    return (
      <View className="flex-1 items-center justify-center gap-2 px-8">
        <Text className="text-lg font-semibold text-foreground">Circle not found</Text>
        <Text className="text-center text-sm text-muted-foreground">
          This link is invalid or the circle may have been removed.
        </Text>
      </View>
    );
  }

  return (
    <CircleDetailScreen
      circleId={circleId}
      onBack={onBack}
      onUserPress={(userId) => router.push(toUserRoute(userId))}
    />
  );
}
