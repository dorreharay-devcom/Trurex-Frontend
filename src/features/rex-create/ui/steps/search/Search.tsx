import React, { useMemo } from 'react';
import { SEARCH_MODE } from '~/types/recommendation/create';
import type { CreateRecFlow } from '~/features/rex-create/hooks/useCreateRecWizard';
import { useRexPlaceSearch } from '~/hooks/recommendation';
import { SearchManualPanel, SearchSelectPanel } from './common';

type Props = {
  place: CreateRecFlow['place'];
  onTagLocationPress: () => void;
  tagLocationLoading: boolean;
};

const Search: React.FC<Props> = ({ place, onTagLocationPress, tagLocationLoading }) => {
  const { searchMode, searchQuery, manualAddress, manualGeotag } = place;

  const placeSearch = useRexPlaceSearch({
    searchQuery,
    enabled: searchMode === SEARCH_MODE.select,
  });
  const addressSearch = useRexPlaceSearch({
    searchQuery: manualAddress,
    enabled:
      searchMode === SEARCH_MODE.manual && manualAddress.trim().length > 0 && manualGeotag == null,
    minQueryLength: 3,
  });
  const addressResults = useMemo(() => {
    if (manualGeotag != null) return [];
    return addressSearch.results.filter(
      (result) => result.latitude != null && result.longitude != null,
    );
  }, [addressSearch.results, manualGeotag]);

  if (searchMode === SEARCH_MODE.manual) {
    return (
      <SearchManualPanel
        place={place}
        addressResults={addressResults}
        isSearchingAddress={addressSearch.isSearching}
        showAddressNoResults={
          manualGeotag == null &&
          addressSearch.canSearch &&
          !addressSearch.isSearching &&
          addressResults.length === 0
        }
        addressSearchErrorMessage={addressSearch.searchErrorMessage}
        onTagLocationPress={onTagLocationPress}
        tagLocationLoading={tagLocationLoading}
      />
    );
  }

  return (
    <SearchSelectPanel
      place={place}
      search={placeSearch}
      onTagLocationPress={onTagLocationPress}
      tagLocationLoading={tagLocationLoading}
    />
  );
};

export default Search;
