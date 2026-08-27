import React from 'react';
import { useRouter } from 'expo-router';
import DiscoverPage from '~/features/discover/ui/DiscoverPage';
import { toUserRoute } from '~/shared/config/routes';
import { openCreateRex, openRecommendation } from '~/shared/lib/navigation/createRex';
import { openCollection } from '~/shared/lib/navigation/openCollection';
import type { Recommendation, RecommendationOpenOptions } from '~/shared/types/recommendation';

export default function DiscoverScreen() {
  const router = useRouter();

  return (
    <DiscoverPage
      onRecommendationPress={(rec: Recommendation, options?: RecommendationOpenOptions) => {
        openRecommendation(router, rec, options);
      }}
      onUserPress={(userId) => router.push(toUserRoute(userId))}
      onCreateRex={() => openCreateRex(router)}
      onOpenCollection={(collectionId) => openCollection(router, collectionId)}
    />
  );
}
