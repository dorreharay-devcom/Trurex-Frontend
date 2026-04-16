import React from 'react';
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

  if (mode === 'manual') {
    return (
      <SearchManualPanel
        manualName={manualName}
        onManualNameChange={onManualNameChange}
        manualAddress={manualAddress}
        onManualAddressChange={onManualAddressChange}
        manualGeotag={manualGeotag}
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
