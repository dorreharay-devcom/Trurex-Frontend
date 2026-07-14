import type { Href } from 'expo-router';
import { Routes } from '~/constants/routes';

export type LegalDocumentKind = 'terms' | 'communityGuidelines' | 'privacy';

const IN_APP_ROUTES: Record<LegalDocumentKind, Href> = {
  terms: Routes.Terms,
  communityGuidelines: Routes.CommunityGuidelines,
  privacy: Routes.Terms,
};

export function getLegalDocumentRoute(kind: LegalDocumentKind): Href {
  return IN_APP_ROUTES[kind];
}
