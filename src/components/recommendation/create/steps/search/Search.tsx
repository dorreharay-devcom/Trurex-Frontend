import React, { useMemo } from 'react';
import type { CreateRecSearchPlace, SearchEntryMode } from '~/types/recommendation/create';
import { useRexPlaceSearch } from '~/hooks/recommendation';
import { SearchManualPanel, SearchSelectPanel } from './common';

type Props = {
  mode: SearchEntryMode;
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  selectedSearchPlace: CreateRecSearchPlace | null;
  onSelectPlace: (place: CreateRecSearchPlace) => void;
  manualName: string;
  onManualNameChange: (v: string) => void;
  manualAddress: string;
  onManualAddressChange: (v: string) => void;
  manualGeotag: { lat: number; lng: number } | null;
  onlineName: string;
  onOnlineNameChange: (v: string) => void;
  onlineWebsiteUrl: string;
  onOnlineWebsiteUrlChange: (v: string) => void;
  onOnlinePlaceChange: (selected: boolean) => void;
  onSelectManualAddress: (place: CreateRecSearchPlace) => void;
  onOpenManual: () => void;
  onBackToSearchSelect: () => void;
  onTagLocationPress: () => void;
  tagLocationLoading: boolean;
};

export const Search: React.FC<Props> = ({
  mode,
  searchQuery,
  onSearchQueryChange,
  selectedSearchPlace,
  onSelectPlace,
  manualName,
  onManualNameChange,
  manualAddress,
  onManualAddressChange,
  manualGeotag,
  onlineName,
  onOnlineNameChange,
  onlineWebsiteUrl,
  onOnlineWebsiteUrlChange,
  onOnlinePlaceChange,
  onSelectManualAddress,
  onOpenManual,
  onBackToSearchSelect,
  onTagLocationPress,
  tagLocationLoading,
}) => {
  const selectMode = mode === 'select';
  const placeSearch = useRexPlaceSearch({
    searchQuery,
    enabled: selectMode,
  });
  const manualAddressSearch = useRexPlaceSearch({
    searchQuery: manualAddress,
    enabled: mode === 'manual' && manualAddress.trim().length > 0 && manualGeotag == null,
    minQueryLength: 3,
  });
  const manualAddressResults = useMemo(() => {
    if (manualGeotag != null) return [];
    return manualAddressSearch.results.filter(
      (place) => place.latitude != null && place.longitude != null,
    );
  }, [manualAddressSearch.results, manualGeotag]);

  if (mode === 'manual') {
    return (
      <SearchManualPanel
        manualName={manualName}
        onManualNameChange={onManualNameChange}
        manualAddress={manualAddress}
        onManualAddressChange={onManualAddressChange}
        manualGeotag={manualGeotag}
        addressResults={manualAddressResults}
        isSearchingAddress={manualAddressSearch.isSearching}
        showAddressNoResults={
          manualGeotag == null &&
          manualAddressSearch.canSearch &&
          !manualAddressSearch.isSearching &&
          manualAddressResults.length === 0
        }
        addressSearchErrorMessage={manualAddressSearch.searchErrorMessage}
        onSelectManualAddress={onSelectManualAddress}
        onTagLocationPress={onTagLocationPress}
        onBackToSearchSelect={onBackToSearchSelect}
        tagLocationLoading={tagLocationLoading}
      />
    );
  }

  return (
    <SearchSelectPanel
      searchQuery={searchQuery}
      onSearchQueryChange={onSearchQueryChange}
      onlineSelected={mode === 'online'}
      onOnlineSelectedChange={onOnlinePlaceChange}
      onlineName={onlineName}
      onOnlineNameChange={onOnlineNameChange}
      onlineWebsiteUrl={onlineWebsiteUrl}
      onOnlineWebsiteUrlChange={onOnlineWebsiteUrlChange}
      selectedSearchPlace={selectedSearchPlace}
      onSelectPlace={onSelectPlace}
      results={placeSearch.results}
      showNoResults={placeSearch.showNoResults}
      isSearching={placeSearch.isSearching}
      canSearch={placeSearch.canSearch}
      searchErrorMessage={placeSearch.searchErrorMessage}
      onOpenManual={onOpenManual}
    />
  );
};
