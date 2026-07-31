import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Theme } from '~/shared/theme/Theme';
import { useActiveCategories } from '~/hooks/useActiveCategories';
import type { UseRexPlaceSearchResult } from '~/features/rex-create/hooks/useRexPlaceSearch';
import type { CreateRecFlow } from '~/features/rex-create/hooks/useCreateRecWizard';
import { SEARCH_MODE } from '~/features/rex-create/types/create';
import type { DbCategoryRow } from '~/shared/api/categories';
import SearchPlaceRow from './SearchPlaceRow';

type Props = {
  place: CreateRecFlow['place'];
  search: UseRexPlaceSearchResult;
};

type BodyProps = Props & {
  categoryRows: DbCategoryRow[] | undefined;
};

function ResultsBody({ place, search, categoryRows }: BodyProps) {
  const { canSearch, isSearching, showNoResults, results } = search;
  const { selectedSearchPlace, selectSearchPlace } = place;

  if (!canSearch) return null;
  if (isSearching) {
    return (
      <View className="items-center py-8">
        <ActivityIndicator color={Theme.colors.primary} />
      </View>
    );
  }
  if (showNoResults) {
    if (selectedSearchPlace) {
      return (
        <SearchPlaceRow
          place={selectedSearchPlace}
          categoryRows={categoryRows}
          selected
          onSelect={selectSearchPlace}
        />
      );
    }
    return <Text className="py-6 text-center text-sm text-muted-foreground">No results found</Text>;
  }

  const selectedInResults =
    selectedSearchPlace != null && results.some((place) => place.id === selectedSearchPlace.id);

  return (
    <>
      {selectedSearchPlace && !selectedInResults ? (
        <SearchPlaceRow
          place={selectedSearchPlace}
          categoryRows={categoryRows}
          selected
          onSelect={selectSearchPlace}
        />
      ) : null}
      {results.map((result) => (
        <SearchPlaceRow
          key={result.id}
          place={result}
          categoryRows={categoryRows}
          selected={place.selectedSearchPlace?.id === result.id}
          onSelect={selectSearchPlace}
        />
      ))}
    </>
  );
}

function SearchResults({ place, search }: Props) {
  const { data: categoryRows } = useActiveCategories(true);
  if (place.searchMode === SEARCH_MODE.online) return null;
  return (
    <>
      {search.searchErrorMessage ? (
        <Text className="py-4 text-center text-sm text-destructive">
          {search.searchErrorMessage}
        </Text>
      ) : null}
      <ResultsBody place={place} search={search} categoryRows={categoryRows} />
    </>
  );
}

export default SearchResults;
