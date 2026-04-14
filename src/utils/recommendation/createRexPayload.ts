import type { SearchEntryMode } from '~/types/recommendation/create';
import type { CreateRexRpcParams } from '~/types/recommendation/rexCategoryCreateConfig';
import { CREATE_REC_SEARCH_PLACES } from '~/constants/recommendation/mockSearchPlaces';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}

export function resolveVisibilityAndCircles(
  selectedCircleIds: Set<string>,
): Pick<CreateRexRpcParams, 'p_visibility' | 'circle_ids'> {
  const ids = [...selectedCircleIds].filter((id) => id !== 'public');
  const uuids = ids.filter(isUuid);
  if (uuids.length > 0) {
    return { p_visibility: 'circles', circle_ids: uuids };
  }
  return { p_visibility: 'public', circle_ids: null };
}

export function getPlaceNameForRex(
  searchMode: SearchEntryMode,
  selectedPlaceId: string | null,
  manualName: string,
): string {
  if (searchMode === 'manual') {
    return manualName.trim() || 'Place';
  }
  const p = selectedPlaceId
    ? CREATE_REC_SEARCH_PLACES.find((x) => x.id === selectedPlaceId)
    : undefined;
  return p?.title.trim() || 'Place';
}

export function getLinkedPlaceId(selectedPlaceId: string | null): string | undefined {
  if (!selectedPlaceId || !isUuid(selectedPlaceId)) return undefined;
  return selectedPlaceId;
}

export function buildCategoryRatingsPayload(
  scores: Record<string, number | null>,
): Record<string, number> {
  return Object.fromEntries(
    Object.entries(scores).filter(([, v]) => v != null) as [string, number][],
  );
}

export function hasNonPublicMockCircleSelection(selectedCircleIds: Set<string>): boolean {
  return [...selectedCircleIds].some((id) => id !== 'public' && !UUID_RE.test(id));
}
