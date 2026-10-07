import React from 'react';
import { useRouter } from 'expo-router';
import GemsPage from '~/features/gems/ui/GemsPage';
import { openCreateRex, openRecommendation, openRex } from '~/shared/lib/navigation/createRex';
import { COLLECTION_FROM, openCollection } from '~/shared/lib/navigation/openCollection';
import { openWishListItem, openWishListWizard } from '~/shared/lib/navigation/wishList';

export default function GemsScreen() {
  const router = useRouter();
  return (
    <GemsPage
      onRecommendationPress={(rec, options) => openRecommendation(router, rec, options)}
      onOpenCollection={(collectionId) =>
        openCollection(router, collectionId, COLLECTION_FROM.gems)
      }
      onOpenWishListWizard={(prefill) => openWishListWizard(router, prefill)}
      onOpenWishListItem={(item, isOwner) => openWishListItem(router, item, isOwner)}
      onNavigateToCreateRex={(source) => openCreateRex(router, { prefill: source })}
      onOpenRexId={(rexId) => openRex(router, rexId)}
    />
  );
}
