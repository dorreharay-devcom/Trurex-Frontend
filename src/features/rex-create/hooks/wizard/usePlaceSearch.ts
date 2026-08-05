import { useCallback, useState } from 'react';
import {
  buildSelectedSearchPlaceFromAddYourOwn,
  type AddYourOwnRecSource,
} from '~/features/rex-create/lib/addYourOwn';
import { persistPlace } from '~/features/rex-create/lib/place';
import { buildSelectedSearchPlaceFromEditRow } from '~/features/rex-create/lib/place';
import {
  SEARCH_MODE,
  type CreateRecSearchPlace,
  type Geotag,
  type ManualPlaceDraft,
  type OnlinePlaceDraft,
  type SearchEntryMode,
} from '~/features/rex-create/types/create';
import type { RexForEditRow } from '~/features/rex-detail/types/rexDetail';

const EMPTY_MANUAL: ManualPlaceDraft = { name: '', address: '', geotag: null };
const EMPTY_ONLINE: OnlinePlaceDraft = { name: '', websiteUrl: '', locationText: '', geotag: null };

export function usePlaceSearch() {
  const [searchMode, setSearchMode] = useState<SearchEntryMode>(SEARCH_MODE.select);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchPlace, setSelectedSearchPlace] = useState<CreateRecSearchPlace | null>(null);
  const [linkedPlaceId, setLinkedPlaceId] = useState<string | null>(null);
  const [manual, setManual] = useState<ManualPlaceDraft>(EMPTY_MANUAL);
  const [online, setOnline] = useState<OnlinePlaceDraft>(EMPTY_ONLINE);

  const selectSearchPlace = useCallback((place: CreateRecSearchPlace) => {
    setSelectedSearchPlace(place);
    setLinkedPlaceId(null);
  }, []);

  const setManualName = useCallback((name: string) => {
    setManual((m) => ({ ...m, name }));
  }, []);

  const setManualAddress = useCallback((address: string) => {
    setManual((m) => ({ ...m, address, geotag: null }));
  }, []);

  const setManualGeotag = useCallback((geotag: Geotag | null) => {
    setManual((m) => ({ ...m, geotag }));
  }, []);

  const selectManualAddress = useCallback((place: CreateRecSearchPlace) => {
    const geotag =
      place.latitude != null && place.longitude != null
        ? { lat: place.latitude, lng: place.longitude }
        : null;
    setManual((m) => ({ ...m, address: place.fullText ?? place.subtitle ?? place.title, geotag }));
  }, []);

  const setOnlineName = useCallback((name: string) => {
    setOnline((o) => ({ ...o, name }));
  }, []);

  const setOnlineWebsiteUrl = useCallback((websiteUrl: string) => {
    setOnline((o) => ({ ...o, websiteUrl }));
  }, []);

  const setOnlineLocationText = useCallback((locationText: string) => {
    setOnline((o) => ({ ...o, locationText, geotag: null }));
  }, []);

  const applyOnlineGeotag = useCallback((result: Geotag & { addressLabel: string }) => {
    setOnline((o) => ({
      ...o,
      locationText: result.addressLabel,
      geotag: { lat: result.lat, lng: result.lng },
    }));
  }, []);

  const clearLinkedPlace = useCallback(() => {
    setLinkedPlaceId(null);
  }, []);

  const openManual = useCallback(() => {
    setSearchMode(SEARCH_MODE.manual);
    setSelectedSearchPlace(null);
    setLinkedPlaceId(null);
  }, []);

  const setOnlinePlaceSelected = useCallback((selected: boolean) => {
    setSearchMode(selected ? SEARCH_MODE.online : SEARCH_MODE.select);
    setSearchQuery('');
    setSelectedSearchPlace(null);
    setLinkedPlaceId(null);
    setManual(EMPTY_MANUAL);
    if (!selected) setOnline(EMPTY_ONLINE);
  }, []);

  const backToSearchSelect = useCallback(() => {
    setSearchMode(SEARCH_MODE.select);
    setManual(EMPTY_MANUAL);
    setOnline(EMPTY_ONLINE);
  }, []);

  const persistPlaceForCategory = useCallback(
    async (categoryCode: string) => {
      if (linkedPlaceId || searchMode === SEARCH_MODE.online) return;
      const id = await persistPlace(searchMode, { categoryCode, manual, selectedSearchPlace });
      setLinkedPlaceId(id);
    },
    [linkedPlaceId, searchMode, manual, selectedSearchPlace],
  );

  const prefillFromAddYourOwn = useCallback((source: AddYourOwnRecSource) => {
    if (source.isOnlinePlace) {
      setSearchMode(SEARCH_MODE.online);
      setOnline({
        ...EMPTY_ONLINE,
        name: source.placeName,
        websiteUrl: source.placeWebsiteUrl ?? '',
      });
      return;
    }
    setSearchQuery(source.placeName);
    setSelectedSearchPlace(buildSelectedSearchPlaceFromAddYourOwn(source));
  }, []);

  const prefillFromEditRow = useCallback((row: RexForEditRow) => {
    if (row.is_online_place) {
      setSearchMode(SEARCH_MODE.online);
      setOnline({
        name: row.place_name ?? '',
        websiteUrl: row.place_website_url ?? '',
        locationText: row.location_text ?? '',
        geotag: null,
      });
      return;
    }
    setSearchMode(SEARCH_MODE.select);
    setSearchQuery(row.place_name ?? '');
    setSelectedSearchPlace(buildSelectedSearchPlaceFromEditRow(row));
    setLinkedPlaceId(row.place_id);
  }, []);

  const reset = useCallback(() => {
    setSearchMode(SEARCH_MODE.select);
    setSearchQuery('');
    setSelectedSearchPlace(null);
    setLinkedPlaceId(null);
    setManual(EMPTY_MANUAL);
    setOnline(EMPTY_ONLINE);
  }, []);

  const hydrateFromDraft = useCallback(
    (draft: {
      searchMode: SearchEntryMode;
      searchQuery: string;
      selectedSearchPlace: CreateRecSearchPlace | null;
      manual: ManualPlaceDraft;
      online: OnlinePlaceDraft;
    }) => {
      setSearchMode(draft.searchMode);
      setSearchQuery(draft.searchQuery);
      setSelectedSearchPlace(draft.selectedSearchPlace);
      setLinkedPlaceId(null);
      setManual(draft.manual);
      setOnline(draft.online);
    },
    [],
  );

  return {
    searchMode,
    searchQuery,
    setSearchQuery,
    selectedSearchPlace,
    selectSearchPlace,
    linkedPlaceId,
    clearLinkedPlace,
    manualName: manual.name,
    setManualName,
    manualAddress: manual.address,
    setManualAddress,
    manualGeotag: manual.geotag,
    setManualGeotag,
    onlineName: online.name,
    setOnlineName,
    onlineWebsiteUrl: online.websiteUrl,
    setOnlineWebsiteUrl,
    onlineLocationText: online.locationText,
    setOnlineLocationText,
    onlineGeotag: online.geotag,
    applyOnlineGeotag,
    selectManualAddress,
    openManual,
    setOnlinePlaceSelected,
    backToSearchSelect,
    persistPlaceForCategory,
    prefillFromAddYourOwn,
    prefillFromEditRow,
    hydrateFromDraft,
    reset,
  };
}
