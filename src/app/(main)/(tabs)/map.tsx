import React from 'react';
import { useRouter } from 'expo-router';
import MapPage from '~/pages/map';
import { openRecommendation } from '~/shared/lib/navigation/createRex';

export default function MapScreen() {
  const router = useRouter();
  return <MapPage onRecommendationPress={(rec) => openRecommendation(router, rec)} />;
}
