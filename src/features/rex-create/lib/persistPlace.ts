import { createManualPlace, upsertGooglePlace } from '~/api/rexPlacesApi';
import {
  SEARCH_MODE,
  type CreateRecSearchPlace,
  type ManualPlaceDraft,
  type SearchEntryMode,
} from '~/types/recommendation/create';

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
