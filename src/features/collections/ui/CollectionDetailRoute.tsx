import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import CollectionDetailScreen from '~/features/gems/ui/CollectionDetailScreen';
import { COLLECTIONS_QUERY_KEYS } from '~/features/collections/config/queryKeys';
import {
  COLLECTION_FROM,
  collectionFallbackRoute,
  type CollectionFrom,
} from '~/shared/lib/navigation/openCollection';
import { openRecommendation } from '~/shared/lib/navigation/createRex';
import { parseOptionalRouteId } from '~/shared/lib/navigation/routeIds';

type Props = {
  from: CollectionFrom;
  /** Expo param key: nested tab stacks use collectionId; share route uses id. */
  paramKey?: 'collectionId' | 'id';
};

export default function CollectionDetailRoute({ from, paramKey = 'collectionId' }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const raw = useLocalSearchParams<{ collectionId?: string | string[]; id?: string | string[] }>();
  const collectionId = parseOptionalRouteId(raw[paramKey]);

  const onBack = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: [...COLLECTIONS_QUERY_KEYS.myCollections] });
    if (from === COLLECTION_FROM.gems || from === COLLECTION_FROM.share) {
      void queryClient.invalidateQueries({
        queryKey: [...COLLECTIONS_QUERY_KEYS.mySavedCollections],
      });
      void queryClient.invalidateQueries({ queryKey: [...COLLECTIONS_QUERY_KEYS.mySavedRexes] });
    }
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(collectionFallbackRoute(from));
  }, [from, queryClient, router]);

  if (!collectionId) {
    return (
      <View className="flex-1 items-center justify-center gap-2 px-8">
        <Text className="text-lg font-semibold text-foreground">Collection not found</Text>
        <Text className="text-center text-sm text-muted-foreground">
          This link is invalid or the collection may have been removed.
        </Text>
      </View>
    );
  }

  return (
    <CollectionDetailScreen
      collectionId={collectionId}
      onBack={onBack}
      onRecommendationPress={(rec, options) => openRecommendation(router, rec, options)}
    />
  );
}
