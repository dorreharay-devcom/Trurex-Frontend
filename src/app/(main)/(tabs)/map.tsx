import React from 'react';
import { useRouter } from 'expo-router';
import MapPage from '~/pages/map';
import { useSetMapPinSheetOpen } from '~/pages/home/ui/addRexFabChrome';
import { openRecommendation } from '~/shared/lib/navigation/createRex';

export default function MapScreen() {
  const router = useRouter();
  const setMapPinSheetOpen = useSetMapPinSheetOpen();
  return (
    <MapPage
      onRecommendationPress={(rec) => openRecommendation(router, rec)}
      onRexSheetOpenChange={setMapPinSheetOpen}
    />
  );
}
