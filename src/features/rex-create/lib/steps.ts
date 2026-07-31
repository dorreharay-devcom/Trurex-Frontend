import {
  CREATE_REC_STEP_ORDER,
  SEARCH_MODE,
  STEP_ID,
  type CreateRecStepId,
  type CreateRecSearchPlace,
  type SearchEntryMode,
} from '~/features/rex-create/types/create';
import { isStrictUuid } from '~/utils/guards';

export function getActiveCreateRecSteps(
  selectedCategoryId: string | null,
  includeSubcategoryStep: boolean,
): CreateRecStepId[] {
  const includeType = selectedCategoryId != null && includeSubcategoryStep;
  return CREATE_REC_STEP_ORDER.filter((id) => id !== STEP_ID.type || includeType);
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
