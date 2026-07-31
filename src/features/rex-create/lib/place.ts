import {
  SEARCH_MODE,
  type CreateRecSearchPlace,
  type SearchEntryMode,
} from '~/types/recommendation/create';
import type { RexForEditRow } from '~/types/recommendation/rexDetail';
import { isStrictUuid } from '~/utils/guards';

export function getPlaceNameForRex(
  searchMode: SearchEntryMode,
  selectedSearchPlace: CreateRecSearchPlace | null,
  manualName: string,
  onlineName: string,
): string {
  if (searchMode === SEARCH_MODE.online) {
    return onlineName.trim() || 'Place';
  }
  if (searchMode === SEARCH_MODE.manual) {
    return manualName.trim() || 'Place';
  }
  return selectedSearchPlace?.title.trim() || 'Place';
}

export function getLinkedPlaceId(linkedPlaceId: string | null): string | undefined {
  if (!linkedPlaceId || !isStrictUuid(linkedPlaceId)) return undefined;
  return linkedPlaceId;
}

export function buildSelectedSearchPlaceFromEditRow(row: RexForEditRow): CreateRecSearchPlace {
  return {
    id: row.place_id ?? row.id,
    source: 'database',
    title: row.place_name ?? '',
    subtitle: '',
    categoryLabel: '',
    categoryId: row.category_code,
    categoryCode: row.category_code,
    fullText: undefined,
  };
}
