import type { Href } from 'expo-router';
import { Routes } from '~/shared/config/routes';

export const COLLECTION_FROM = {
  gems: 'gems',
  profile: 'profile',
  share: 'share',
} as const;

export type CollectionFrom = (typeof COLLECTION_FROM)[keyof typeof COLLECTION_FROM];

type Router = {
  push: (href: Href) => void;
};

export function toCollectionRoute(collectionId: string): string {
  return `/collection/${collectionId}`;
}

export function openCollection(
  router: Router,
  collectionId: string,
  from: CollectionFrom = COLLECTION_FROM.share,
): void {
  if (from === COLLECTION_FROM.gems) {
    router.push(`/gems/${collectionId}` as Href);
    return;
  }
  if (from === COLLECTION_FROM.profile) {
    router.push(`/profile/${collectionId}` as Href);
    return;
  }
  router.push(toCollectionRoute(collectionId) as Href);
}

export function collectionFallbackRoute(from: CollectionFrom): Href {
  if (from === COLLECTION_FROM.profile) return Routes.Profile;
  if (from === COLLECTION_FROM.gems) return Routes.Gems;
  return Routes.Gems;
}
