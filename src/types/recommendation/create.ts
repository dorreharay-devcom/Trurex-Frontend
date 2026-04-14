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

export type CreateRecSearchPlace = {
  id: string;
  title: string;
  subtitle: string;
  categoryLabel: string;
  categoryId: string;
};

export function getActiveCreateRecSteps(selectedCategoryId: string | null): CreateRecStepId[] {
  const includeType = selectedCategoryId === REAL_ESTATE_CATEGORY_ID;
  return CREATE_REC_STEP_ORDER.filter((id) => id !== 'type' || includeType);
}
