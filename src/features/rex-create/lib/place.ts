import {
  createManualPlace,
  upsertGooglePlace,
  type GooglePlacesSearchResultItem,
} from '~/features/rex-create/api/rexPlacesApi';
import {
  SEARCH_MODE,
  type CreateRecSearchPlace,
  type ManualPlaceDraft,
  type SearchEntryMode,
} from '~/features/rex-create/types/create';
import type { RexForEditRow } from '~/features/rex-detail/types/rexDetail';
import { isStrictUuid } from '~/shared/lib/data/guards';

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

export function mapSearchItemToCreateRecPlace(
  r: GooglePlacesSearchResultItem,
): CreateRecSearchPlace | null {
  if (r.source === 'database') {
    if (!r.id) return null;
    const name = r.categoryName?.trim();
    return {
      id: r.id,
      source: 'database',
      title: r.mainText,
      subtitle: r.secondaryText ?? r.fullText ?? '',
      categoryLabel: name && name.length > 0 ? name : 'Saved',
      categoryId: r.categoryId ?? null,
      categoryCode: r.categoryCode ?? null,
      categoryIcon: r.categoryIcon?.trim() || null,
      provider: r.provider,
      providerPlaceId: r.providerPlaceId,
      placeResourceName: r.placeResourceName,
      fullText: r.fullText,
      latitude: r.latitude ?? null,
      longitude: r.longitude ?? null,
    };
  }
  const pid = r.providerPlaceId;
  if (!pid) return null;
  return {
    id: `google:${pid}`,
    source: 'google',
    title: r.mainText,
    subtitle: r.secondaryText ?? '',
    categoryLabel: 'Google',
    categoryId: null,
    categoryCode: null,
    categoryIcon: null,
    provider: r.provider,
    providerPlaceId: r.providerPlaceId,
    placeResourceName: r.placeResourceName,
    fullText: r.fullText,
    latitude: r.latitude ?? null,
    longitude: r.longitude ?? null,
  };
}

export function mapSearchResponseToPlaces(
  results: GooglePlacesSearchResultItem[],
): CreateRecSearchPlace[] {
  return results.flatMap((row) => {
    const p = mapSearchItemToCreateRecPlace(row);
    return p ? [p] : [];
  });
}

type PersistPlaceArgs = {
  categoryCode: string;
  manual: ManualPlaceDraft;
  selectedSearchPlace: CreateRecSearchPlace | null;
};

async function persistManualPlace(categoryCode: string, manual: ManualPlaceDraft): Promise<string> {
  const name = manual.name.trim();
  if (!name) throw new Error('Enter a place name.');
  const address = manual.address.trim();
  if (!address) throw new Error('Choose an address or tag your current location.');
  if (!manual.geotag) {
    throw new Error('Choose a valid address from suggestions or tag your current location.');
  }
  const row = await createManualPlace({
    p_name: name,
    p_category_code: categoryCode,
    p_normalized_address: address,
    p_latitude: manual.geotag.lat,
    p_longitude: manual.geotag.lng,
  });
  return row.id;
}

async function persistSelectedPlace(
  categoryCode: string,
  sel: CreateRecSearchPlace | null,
): Promise<string> {
  if (!sel) throw new Error('Select a place.');
  if (sel.source === 'database') return sel.id;
  if (sel.source !== 'google') throw new Error('Unsupported place source.');
  if (!sel.providerPlaceId) throw new Error('Missing Google place id.');
  const row = await upsertGooglePlace({
    p_provider_place_id: sel.providerPlaceId,
    p_name: sel.title,
    p_category_code: categoryCode,
    p_normalized_address: sel.fullText ?? sel.subtitle ?? null,
    p_latitude: sel.latitude ?? null,
    p_longitude: sel.longitude ?? null,
  });
  return row.id;
}

export async function persistPlace(
  searchMode: SearchEntryMode,
  { categoryCode, manual, selectedSearchPlace }: PersistPlaceArgs,
): Promise<string> {
  const code = categoryCode.trim();
  if (!code) throw new Error('Pick a category first.');
  if (searchMode === SEARCH_MODE.manual) return persistManualPlace(code, manual);
  return persistSelectedPlace(code, selectedSearchPlace);
}
