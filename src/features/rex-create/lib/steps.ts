import {
  CREATE_REC_STEP_ORDER,
  SEARCH_MODE,
  STEP_ID,
  type CreateRecStepId,
  type CreateRecSearchPlace,
  type SearchEntryMode,
} from '~/features/rex-create/types/create';
import { isStrictUuid } from '~/shared/lib/data/guards';
import {
  PRODUCT_BRAND_CATEGORY_CODE,
  PRODUCT_BRAND_SUBCATEGORY_CODE,
} from '~/features/wish-list/config/rexBridge';

export function isCreateRecStepId(value: unknown): value is CreateRecStepId {
  return typeof value === 'string' && (CREATE_REC_STEP_ORDER as readonly string[]).includes(value);
}

export function parseCreateStepParam(value: string | undefined): CreateRecStepId | null {
  if (!value) return null;
  return isCreateRecStepId(value) ? value : null;
}

export function getActiveCreateRecSteps(
  selectedCategoryId: string | null,
  includeSubcategoryStep: boolean,
  selectedSubcategoryCode: string | null,
): CreateRecStepId[] {
  const includeType = selectedCategoryId != null && includeSubcategoryStep;
  const includeBrandProduct =
    selectedCategoryId === PRODUCT_BRAND_CATEGORY_CODE &&
    selectedSubcategoryCode === PRODUCT_BRAND_SUBCATEGORY_CODE;
  return CREATE_REC_STEP_ORDER.filter((id) => {
    if (id === STEP_ID.type) return includeType;
    if (id === STEP_ID.brandProduct) return includeBrandProduct;
    return true;
  });
}

export function suggestedCategoryFromSearch(
  searchMode: SearchEntryMode,
  selectedSearchPlace: CreateRecSearchPlace | null,
): string | null {
  if (searchMode !== SEARCH_MODE.select || !selectedSearchPlace) return null;
  const code = selectedSearchPlace.categoryCode?.trim();
  if (code) return code;
  const cid = selectedSearchPlace.categoryId?.trim();
  if (!cid || isStrictUuid(cid)) return null;
  return cid;
}

export type CanProceedDeps = {
  searchMode: SearchEntryMode;
  manualName: string;
  manualAddress: string;
  manualGeotag: { lat: number; lng: number } | null;
  onlineName: string;
  selectedSearchPlace: CreateRecSearchPlace | null;
  selectedCategoryId: string | null;
  selectedCircleIds: Set<string>;
  privateRex: boolean;
  selectedSubcategoryCode: string | null;
  brandName: string;
};

function hasCompleteManualPlace(d: CanProceedDeps): boolean {
  return (
    d.manualName.trim().length > 0 && d.manualAddress.trim().length > 0 && d.manualGeotag != null
  );
}

function hasCompleteSearchPlace(d: CanProceedDeps): boolean {
  if (d.searchMode === SEARCH_MODE.online) return d.onlineName.trim().length > 0;
  if (d.searchMode === SEARCH_MODE.manual) return hasCompleteManualPlace(d);
  return d.selectedSearchPlace !== null;
}

const STEP_GUARDS: Record<CreateRecStepId, (d: CanProceedDeps) => boolean> = {
  search: hasCompleteSearchPlace,
  category: (d) => d.selectedCategoryId !== null,
  type: (d) => d.selectedSubcategoryCode !== null,
  brandProduct: (d) => d.brandName.trim().length > 0,
  scorecard: () => true,
  photos: () => true,
  circles: (d) => d.privateRex || d.selectedCircleIds.size > 0,
  confirm: () => true,
};

export function canProceedForStep(stepId: CreateRecStepId, d: CanProceedDeps): boolean {
  return STEP_GUARDS[stepId](d);
}

export function resolveStepIdAfterStepsChange(
  previous: CreateRecStepId,
  activeSteps: CreateRecStepId[],
): CreateRecStepId {
  if (activeSteps.includes(previous)) return previous;
  const start = CREATE_REC_STEP_ORDER.indexOf(previous);
  for (let i = Math.max(0, start); i < CREATE_REC_STEP_ORDER.length; i++) {
    const candidate = CREATE_REC_STEP_ORDER[i];
    if (activeSteps.includes(candidate)) return candidate;
  }
  return activeSteps[0] ?? STEP_ID.search;
}
