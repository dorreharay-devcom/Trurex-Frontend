import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DiscoverPage from '~/features/discover/ui/DiscoverPage';
import { toUserRoute } from '~/shared/config/routes';
import { openCreateRex, openRecommendation } from '~/shared/lib/navigation/createRex';
import { firstRouteParam } from '~/shared/lib/navigation/routeIds';
import type { Recommendation, RecommendationOpenOptions } from '~/shared/types/recommendation';

export default function DiscoverScreen() {
  const router = useRouter();
  const { q } = useLocalSearchParams<{ q?: string | string[] }>();

  return (
    <DiscoverPage
      searchQuery={firstRouteParam(q) ?? ''}
      onRecommendationPress={(rec: Recommendation, options?: RecommendationOpenOptions) => {
        openRecommendation(router, rec, options);
      }}
      onUserPress={(userId) => router.push(toUserRoute(userId))}
      onCreateRex={() => openCreateRex(router)}
    />
  );
}
