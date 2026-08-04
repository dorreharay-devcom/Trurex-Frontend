export const CREATE_REC_STEP_ORDER = [
  'search',
  'category',
  'type',
  'scorecard',
  'photos',
  'circles',
  'confirm',
] as const;

export type CreateRecStepId = (typeof CREATE_REC_STEP_ORDER)[number];

export const STEP_ID = {
  search: 'search',
  category: 'category',
  type: 'type',
  scorecard: 'scorecard',
  photos: 'photos',
  circles: 'circles',
  confirm: 'confirm',
} as const satisfies Record<CreateRecStepId, CreateRecStepId>;

export const SEARCH_MODE = {
  select: 'select',
  manual: 'manual',
  online: 'online',
} as const;

export type SearchEntryMode = (typeof SEARCH_MODE)[keyof typeof SEARCH_MODE];

export type PlaceSearchSource = 'database' | 'google';

export type Geotag = { lat: number; lng: number };

export type ManualPlaceDraft = {
  name: string;
  address: string;
  geotag: Geotag | null;
};

export type OnlinePlaceDraft = {
  name: string;
  websiteUrl: string;
  locationText: string;
  geotag: Geotag | null;
};

export type CreateRecSearchPlace = {
  id: string;
  source: PlaceSearchSource;
  title: string;
  subtitle: string;
  categoryLabel: string;
  categoryId: string | null;
  categoryCode?: string | null;
  categoryIcon?: string | null;
  provider?: string | null;
  providerPlaceId?: string | null;
  placeResourceName?: string;
  fullText?: string;
  latitude?: number | null;
  longitude?: number | null;
};
