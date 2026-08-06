import React from 'react';
import { useRouter } from 'expo-router';
import GemsPage from '~/features/gems/ui/GemsPage';
import { openRecommendation } from '~/shared/lib/navigation/createRex';
import { COLLECTION_FROM, openCollection } from '~/shared/lib/navigation/openCollection';

export default function GemsScreen() {
  const router = useRouter();
  return (
    <GemsPage
      onRecommendationPress={(rec, options) => openRecommendation(router, rec, options)}
      onOpenCollection={(collectionId) =>
        openCollection(router, collectionId, COLLECTION_FROM.gems)
      }
    />
  );
}
