import { StorageService } from '~/shared/lib/storage/kv';
import type { CreateRecSearchPlace, SearchEntryMode } from '~/features/rex-create/types/create';
import { SEARCH_MODE } from '~/features/rex-create/types/create';

const DRAFT_KEY = 'trurex_create_rex_wizard_draft_v1';
const DRAFT_VERSION = 1 as const;

export type CreateWizardDraftV1 = {
  version: typeof DRAFT_VERSION;
  savedAt: number;
  searchMode: SearchEntryMode;
  searchQuery: string;
  selectedSearchPlace: CreateRecSearchPlace | null;
  manual: { name: string; address: string; geotag: { lat: number; lng: number } | null };
  online: {
    name: string;
    websiteUrl: string;
    locationText: string;
    geotag: { lat: number; lng: number } | null;
  };
  selectedCategoryId: string | null;
  selectedSubcategoryCode: string | null;
  scoreQuickTip: string;
  scoreReview: string;
  scoreValueForMoney: number | null;
  categoryRatings: Record<string, number | null>;
  questionAnswers: Record<string, string>;
  selectedTagSlugs: string[];
  photoStoragePaths: string[];
  selectedCircleIds: string[];
  privateRex: boolean;
};

function isSearchMode(value: unknown): value is SearchEntryMode {
  return (
    value === SEARCH_MODE.select || value === SEARCH_MODE.manual || value === SEARCH_MODE.online
  );
}

/** Storage object keys only (not file/content/http URIs that die after kill). */
export function isDurablePhotoStoragePath(path: string): boolean {
  const p = path.trim();
  if (!p) return false;
  // Schemed URIs (file:, content:, http(s):, blob:, data:, ph:, …)
  if (/^[a-z][a-z0-9+.-]*:/i.test(p)) return false;
  return true;
}

export function durablePhotoStoragePaths(paths: string[]): string[] {
  return paths.filter(isDurablePhotoStoragePath);
}

export function createWizardDraftIsMeaningful(draft: CreateWizardDraftV1): boolean {
  if (draft.selectedSearchPlace != null) return true;
  if (draft.manual.name.trim() || draft.manual.address.trim()) return true;
  if (draft.online.name.trim()) return true;
  if (draft.selectedCategoryId) return true;
  if (draft.scoreQuickTip.trim() || draft.scoreReview.trim()) return true;
  if (draft.photoStoragePaths.length > 0) return true;
  if (draft.selectedCircleIds.length > 0 || draft.privateRex) return true;
  return false;
}

export async function loadCreateWizardDraft(): Promise<CreateWizardDraftV1 | null> {
  try {
    const raw = await StorageService.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const draft = parsed as CreateWizardDraftV1;
    if (draft.version !== DRAFT_VERSION) return null;
    if (!isSearchMode(draft.searchMode)) return null;
    return {
      ...draft,
      photoStoragePaths: durablePhotoStoragePaths(
        Array.isArray(draft.photoStoragePaths) ? draft.photoStoragePaths : [],
      ),
    };
  } catch {
    return null;
  }
}

export async function saveCreateWizardDraft(draft: CreateWizardDraftV1): Promise<void> {
  if (!createWizardDraftIsMeaningful(draft)) {
    await clearCreateWizardDraft();
    return;
  }
  await StorageService.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export async function clearCreateWizardDraft(): Promise<void> {
  await StorageService.removeItem(DRAFT_KEY);
}

export function buildCreateWizardDraft(
  partial: Omit<CreateWizardDraftV1, 'version' | 'savedAt'>,
): CreateWizardDraftV1 {
  return {
    version: DRAFT_VERSION,
    savedAt: Date.now(),
    ...partial,
    photoStoragePaths: durablePhotoStoragePaths(partial.photoStoragePaths),
  };
}
