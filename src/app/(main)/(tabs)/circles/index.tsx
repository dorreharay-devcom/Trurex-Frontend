import React from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import CirclesPage from '~/features/circles/ui/CirclesPage';
import { toCircleRoute, toUserRoute } from '~/shared/config/routes';

export default function CirclesScreen() {
  const router = useRouter();
  const isActive = useIsFocused();
  return (
    <CirclesPage
      isActive={isActive}
      onUserPress={(userId) => router.push(toUserRoute(userId))}
      onOpenCircle={(circleId) => router.push(toCircleRoute(circleId))}
    />
  );
}
