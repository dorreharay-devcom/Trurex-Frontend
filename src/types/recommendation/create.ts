import { REAL_ESTATE_CATEGORY_ID } from '~/constants/recommendation/rexCategories';

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

export type SearchEntryMode = 'select' | 'manual';

export type PlaceSearchSource = 'database' | 'google';

export type CreateRecSearchPlace = {
  id: string;
  source: PlaceSearchSource;
  title: string;
  subtitle: string;
  categoryLabel: string;
  /** Mock / catalog hints only; API results use `null`. */
  categoryId: string | null;
  provider?: string | null;
  providerPlaceId?: string | null;
  placeResourceName?: string;
  fullText?: string;
  latitude?: number | null;
  longitude?: number | null;
};

export function getActiveCreateRecSteps(selectedCategoryId: string | null): CreateRecStepId[] {
  const includeType = selectedCategoryId === REAL_ESTATE_CATEGORY_ID;
  return CREATE_REC_STEP_ORDER.filter((id) => id !== 'type' || includeType);
}
