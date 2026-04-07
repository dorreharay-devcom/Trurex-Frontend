import React, { useMemo } from 'react';
import type { CreateRecSearchPlace, SearchEntryMode } from '~/types/recommendation/create';
import { getSearchStepSelectState } from '~/utils/recommendation/searchPlacesFilter';
import { SearchManualPanel, SearchSelectPanel } from './common';

type Props = {
  mode: SearchEntryMode;
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  selectedPlaceId: string | null;
  onSelectPlace: (place: CreateRecSearchPlace) => void;
  manualName: string;
  onManualNameChange: (v: string) => void;
  manualAddress: string;
  onManualAddressChange: (v: string) => void;
  manualGeotag: { lat: number; lng: number } | null;
  onOpenManual: () => void;
  onBackToSearchSelect: () => void;
  onTagLocationPress: () => void;
};

export const Search: React.FC<Props> = ({
  mode,
  searchQuery,
  onSearchQueryChange,
  selectedPlaceId,
  onSelectPlace,
  manualName,
  onManualNameChange,
  manualAddress,
  onManualAddressChange,
  manualGeotag,
  onOpenManual,
  onBackToSearchSelect,
  onTagLocationPress,
}) => {
  const { results, showNoResults } = useMemo(
    () => getSearchStepSelectState(searchQuery),
    [searchQuery],
  );

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
      />
    );
  }

  return (
    <SearchSelectPanel
      searchQuery={searchQuery}
      onSearchQueryChange={onSearchQueryChange}
      selectedPlaceId={selectedPlaceId}
      onSelectPlace={onSelectPlace}
      results={results}
      showNoResults={showNoResults}
      onOpenManual={onOpenManual}
    />
  );
};
