import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { takeWishListItemDetail } from '~/features/wish-list/lib/wishListItemDetailHandoff';
import type { WishListItemRow } from '~/features/wish-list/api/types';
import { firstRouteParam } from '~/shared/lib/navigation/routeIds';

export function useWishListItemPage() {
  const raw = useLocalSearchParams<{ itemId: string | string[] }>();
  const itemId = firstRouteParam(raw.itemId) ?? '';

  const [item, setItem] = useState<WishListItemRow | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const handoff = takeWishListItemDetail();
    setItem(handoff?.item ?? null);
    setIsOwner(handoff?.isOwner ?? false);
    setReady(true);
  }, []);

  return { itemId, ready, item, isOwner };
}

export type WishListItemPageState = ReturnType<typeof useWishListItemPage>;
