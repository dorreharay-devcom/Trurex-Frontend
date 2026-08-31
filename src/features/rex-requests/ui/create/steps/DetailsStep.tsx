import React, { useCallback } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { X } from 'lucide-react-native';
import { Theme, textFieldCaretStyle, textFieldMultilineStyle } from '~/shared/theme/Theme';
import { webNoOutline } from '~/shared/lib/ui/styles';
import { CREATE_REC_STEP_INNER } from '~/features/rex-create/config/layout';
import { useActiveCategories } from '~/shared/hooks/useActiveCategories';
import { useRexPlaceSearch } from '~/features/rex-create/hooks/useRexPlaceSearch';
import {
  useManualPlaceGeotag,
  type ManualPlaceGeotagResult,
} from '~/features/rex-create/hooks/useManualPlaceGeotag';
import SearchQueryField from '~/features/rex-create/ui/steps/search/common/SearchQueryField';
import SearchPlaceRow from '~/features/rex-create/ui/steps/search/common/SearchPlaceRow';
import TagLocationButton from '~/features/rex-create/ui/steps/search/common/TagLocationButton';
import CreateStepTitle from '~/features/rex-create/ui/CreateStepTitle';
import type { CreateRexRequestFlow } from '~/features/rex-requests/hooks/create/useCreateRexRequestWizard';
import type { UseRexPlaceSearchResult } from '~/features/rex-create/hooks/useRexPlaceSearch';
import type { CreateRecSearchPlace } from '~/features/rex-create/types/create';
import type { DbCategoryRow } from '~/shared/api/categories';

const MAX_LOOKING_FOR_LENGTH = 500;

type Props = {
  flow: CreateRexRequestFlow;
};

type LocationSuggestionsProps = {
  search: UseRexPlaceSearchResult;
  categoryRows: DbCategoryRow[] | undefined;
  onSelect: (place: CreateRecSearchPlace) => void;
};

function LocationSuggestions({ search, categoryRows, onSelect }: LocationSuggestionsProps) {
  if (search.isSearching) {
    return (
      <View className="items-center py-3">
        <ActivityIndicator size="small" color={Theme.colors.primary} />
      </View>
    );
  }
  if (search.showNoResults) {
    return <Text className="py-2 text-xs text-muted-foreground">No matching places found.</Text>;
  }
  return (
    <>
      {search.results.map((place) => (
        <SearchPlaceRow
          key={place.id}
          place={place}
          categoryRows={categoryRows}
          selected={false}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

function DetailsStep({ flow }: Props) {
  const {
    lookingForText,
    setLookingForText,
    locationQuery,
    setLocationQuery,
    hasLocation,
    selectPlace,
    applyGeotag,
    clearLocation,
  } = flow.details;
  const { data: categoryRows } = useActiveCategories(true);

  const search = useRexPlaceSearch({
    searchQuery: locationQuery,
    enabled: !hasLocation && locationQuery.trim().length > 0,
  });

  const onGeotagSuccess = useCallback(
    (result: ManualPlaceGeotagResult) => applyGeotag(result),
    [applyGeotag],
  );
  const { isGeotagging, geotag } = useManualPlaceGeotag({ onSuccess: onGeotagSuccess });

  const showSuggestions = !hasLocation && locationQuery.trim().length > 0;

  return (
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="items-center pb-24"
    >
      <View className={CREATE_REC_STEP_INNER}>
        <View className="items-center gap-1 px-1 pb-4">
          <CreateStepTitle>What are you looking for?</CreateStepTitle>
          <Text className="text-center text-sm text-muted-foreground">
            Your circles will see this request.
          </Text>
        </View>

        <TextInput
          placeholder="e.g. Looking for the best tacos in Austin"
          placeholderTextColor={Theme.colors.secondaryText}
          value={lookingForText}
          onChangeText={setLookingForText}
          maxLength={MAX_LOOKING_FOR_LENGTH}
          multiline
          numberOfLines={2}
          className="min-h-[64px] w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-base text-foreground"
          style={[textFieldCaretStyle, textFieldMultilineStyle, webNoOutline]}
        />
        <Text className="w-full text-right text-[10px] text-muted-foreground">
          {lookingForText.length}/{MAX_LOOKING_FOR_LENGTH}
        </Text>

        <View className="mt-6 w-full">
          {hasLocation ? (
            <View className="flex-row items-center gap-3 rounded-xl border-2 border-primary bg-primary/10 p-3">
              <Text className="min-w-0 flex-1 text-sm text-foreground" numberOfLines={1}>
                {locationQuery}
              </Text>
              <Pressable
                onPress={clearLocation}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Clear location"
              >
                <X size={16} color={Theme.colors.secondaryText} />
              </Pressable>
            </View>
          ) : (
            <SearchQueryField
              value={locationQuery}
              onChangeText={setLocationQuery}
              placeholder="Search a suburb or address"
            />
          )}

          {showSuggestions ? (
            <LocationSuggestions
              search={search}
              categoryRows={categoryRows}
              onSelect={selectPlace}
            />
          ) : null}

          <TagLocationButton loading={isGeotagging} geotag={null} onPress={() => void geotag()} />
        </View>
      </View>
    </ScrollView>
  );
}

export default DetailsStep;
