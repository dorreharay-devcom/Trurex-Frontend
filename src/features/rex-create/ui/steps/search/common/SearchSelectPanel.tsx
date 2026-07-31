import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Check, Plus } from 'lucide-react-native';
import { CREATE_REC_STEP_INNER } from '~/constants/recommendation/createLayout';
import CreateStepTitle from '../../../CreateStepTitle';
import { Theme } from '~/shared/theme/Theme';
import { useActiveCategories } from '~/hooks/useActiveCategories';
import type { UseRexPlaceSearchResult } from '~/hooks/recommendation';
import type { CreateRecFlow } from '~/features/rex-create/hooks/useCreateRecWizard';
import { SEARCH_MODE, type CreateRecSearchPlace, type Geotag } from '~/types/recommendation/create';
import type { DbCategoryRow } from '~/types/recommendation/rexCategoryCreateConfig';
import { isAndroid, isWeb } from '~/utils';
import { cn, webDisabledCursorStyle } from '~/utils/general';
import SearchPlaceRow from './SearchPlaceRow';
import SearchQueryField from './SearchQueryField';
import SearchTextField from './SearchTextField';
import TagLocationButton from './TagLocationButton';

const SCROLL_PAD = 'pb-36';

function SearchResults({
  errorMessage,
  canSearch,
  isSearching,
  showNoResults,
  results,
  selectedSearchPlace,
  onSelectPlace,
  categoryRows,
}: {
  errorMessage: string | null;
  canSearch: boolean;
  isSearching: boolean;
  showNoResults: boolean;
  results: CreateRecSearchPlace[];
  selectedSearchPlace: CreateRecSearchPlace | null;
  onSelectPlace: (place: CreateRecSearchPlace) => void;
  categoryRows: DbCategoryRow[] | undefined;
}) {
  const idle = canSearch && !isSearching;
  const selectedInResults =
    selectedSearchPlace != null && results.some((place) => place.id === selectedSearchPlace.id);

  return (
    <>
      {errorMessage ? (
        <Text className="py-4 text-center text-sm text-destructive">{errorMessage}</Text>
      ) : null}

      {canSearch && isSearching ? (
        <View className="items-center py-8">
          <ActivityIndicator color={Theme.colors.primary} />
        </View>
      ) : null}

      {idle && showNoResults && !selectedSearchPlace ? (
        <Text className="py-6 text-center text-sm text-muted-foreground">No results found</Text>
      ) : null}

      {idle && selectedSearchPlace && !selectedInResults ? (
        <SearchPlaceRow
          place={selectedSearchPlace}
          categoryRows={categoryRows}
          selected
          onSelect={onSelectPlace}
        />
      ) : null}

      {idle && !showNoResults
        ? results.map((place) => (
            <SearchPlaceRow
              key={place.id}
              place={place}
              categoryRows={categoryRows}
              selected={selectedSearchPlace?.id === place.id}
              onSelect={onSelectPlace}
            />
          ))
        : null}
    </>
  );
}

function AddManualPlaceButton({ disabled, onPress }: { disabled: boolean; onPress: () => void }) {
  const disabledCursor = disabled && isWeb ? webDisabledCursorStyle : undefined;
  return (
    <View className={cn('mt-2 w-full', disabled && 'cursor-not-allowed')} style={disabledCursor}>
      <Pressable
        onPress={() => {
          if (disabled) return;
          onPress();
        }}
        disabled={disabled && !isWeb}
        accessibilityState={{ disabled }}
        style={disabledCursor}
        className={cn(
          'w-full flex-row items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-transparent p-4',
          disabled
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer active:border-primary/40 active:opacity-90',
        )}
        accessibilityRole="button"
        accessibilityLabel="Add a new place manually"
      >
        <Plus size={20} color={Theme.colors.secondaryText} />
        <Text className="text-base font-medium text-muted-foreground">
          Add a new place manually
        </Text>
      </Pressable>
    </View>
  );
}

function OnlinePlaceToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      className="mb-3 mt-6 flex-row items-center gap-2 self-start active:opacity-90"
    >
      <View
        className={cn(
          'h-5 w-5 items-center justify-center rounded border',
          checked ? 'border-primary bg-primary' : 'border-muted-foreground bg-transparent',
        )}
      >
        {checked ? <Check size={13} color={Theme.colors.primaryForeground} /> : null}
      </View>
      <Text className="text-sm text-foreground">No fixed address (person, service, or online)</Text>
    </Pressable>
  );
}

function OnlineEntryForm({
  name,
  onNameChange,
  websiteUrl,
  onWebsiteUrlChange,
  locationText,
  onLocationTextChange,
  geotag,
  tagLocationLoading,
  onTagLocationPress,
}: {
  name: string;
  onNameChange: (v: string) => void;
  websiteUrl: string;
  onWebsiteUrlChange: (v: string) => void;
  locationText: string;
  onLocationTextChange: (v: string) => void;
  geotag: Geotag | null;
  tagLocationLoading: boolean;
  onTagLocationPress: () => void;
}) {
  return (
    <View className="mb-2 w-full gap-3">
      <SearchTextField
        value={name}
        onChangeText={onNameChange}
        placeholder="Name…"
        autoCapitalize="words"
      />
      <SearchTextField
        value={websiteUrl}
        onChangeText={onWebsiteUrlChange}
        placeholder="Link to site (optional)"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        textContentType="URL"
      />
      <SearchTextField
        value={locationText}
        onChangeText={onLocationTextChange}
        placeholder="Address or location (optional)"
        editable={isAndroid || !tagLocationLoading}
      />
      <TagLocationButton
        loading={tagLocationLoading}
        geotag={geotag}
        onPress={onTagLocationPress}
      />
    </View>
  );
}

type Props = {
  place: CreateRecFlow['place'];
  search: UseRexPlaceSearchResult;
  onTagLocationPress: () => void;
  tagLocationLoading: boolean;
};

function SearchSelectPanel({ place, search, onTagLocationPress, tagLocationLoading }: Props) {
  const {
    searchQuery,
    setSearchQuery,
    selectedSearchPlace,
    selectSearchPlace,
    openManual,
    setOnlinePlaceSelected,
  } = place;
  const onlineSelected = place.searchMode === SEARCH_MODE.online;
  const { data: categoryRows } = useActiveCategories(true);

  return (
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      automaticallyAdjustKeyboardInsets
      showsVerticalScrollIndicator={false}
      contentContainerClassName={cn('items-center', SCROLL_PAD)}
    >
      <View className={CREATE_REC_STEP_INNER}>
        <View className="items-center space-y-2 px-1 pb-2">
          <CreateStepTitle>What are you recommending?</CreateStepTitle>
          <Text className="text-center text-sm text-muted-foreground">
            Search for a place, person, or service
          </Text>
        </View>

        <SearchQueryField
          value={searchQuery}
          onChangeText={setSearchQuery}
          editable={!onlineSelected}
        />

        {!onlineSelected ? (
          <SearchResults
            errorMessage={search.searchErrorMessage}
            canSearch={search.canSearch}
            isSearching={search.isSearching}
            showNoResults={search.showNoResults}
            results={search.results}
            selectedSearchPlace={selectedSearchPlace}
            onSelectPlace={selectSearchPlace}
            categoryRows={categoryRows}
          />
        ) : null}

        <AddManualPlaceButton disabled={onlineSelected} onPress={openManual} />

        <OnlinePlaceToggle checked={onlineSelected} onChange={setOnlinePlaceSelected} />

        {onlineSelected ? (
          <OnlineEntryForm
            name={place.onlineName}
            onNameChange={place.setOnlineName}
            websiteUrl={place.onlineWebsiteUrl}
            onWebsiteUrlChange={place.setOnlineWebsiteUrl}
            locationText={place.onlineLocationText}
            onLocationTextChange={place.setOnlineLocationText}
            geotag={place.onlineGeotag}
            tagLocationLoading={tagLocationLoading}
            onTagLocationPress={onTagLocationPress}
          />
        ) : null}
      </View>
    </ScrollView>
  );
}

export default SearchSelectPanel;
