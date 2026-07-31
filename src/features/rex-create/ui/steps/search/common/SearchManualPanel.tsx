import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { CREATE_REC_STEP_INNER } from '~/constants/recommendation/createLayout';
import CreateStepTitle from '../../../CreateStepTitle';
import { Theme } from '~/shared/theme/Theme';
import { isAndroid } from '~/utils';
import { cn } from '~/utils/general';
import type { CreateRecFlow } from '~/features/rex-create/hooks/useCreateRecWizard';
import type { CreateRecSearchPlace } from '~/types/recommendation/create';
import { useActiveCategories } from '~/hooks/useActiveCategories';
import SearchPlaceRow from './SearchPlaceRow';
import SearchTextField from './SearchTextField';
import TagLocationButton from './TagLocationButton';

const SCROLL_PAD = 'pb-36';

function AddressSearchStatus({
  errorMessage,
  searching,
  showNoResults,
}: {
  errorMessage: string | null;
  searching: boolean;
  showNoResults: boolean;
}) {
  return (
    <>
      {errorMessage ? <Text className="-mt-4 text-sm text-destructive">{errorMessage}</Text> : null}
      {searching ? (
        <View className="-mt-4 items-center py-3">
          <ActivityIndicator color={Theme.colors.primary} />
        </View>
      ) : null}
      {!searching && showNoResults ? (
        <Text className="-mt-4 text-sm text-muted-foreground">
          Choose a valid address from suggestions or tag your current location.
        </Text>
      ) : null}
    </>
  );
}

type Props = {
  place: CreateRecFlow['place'];
  addressResults: CreateRecSearchPlace[];
  isSearchingAddress: boolean;
  showAddressNoResults: boolean;
  addressSearchErrorMessage: string | null;
  onTagLocationPress: () => void;
  tagLocationLoading: boolean;
};

function SearchManualPanel({
  place,
  addressResults,
  isSearchingAddress,
  showAddressNoResults,
  addressSearchErrorMessage,
  onTagLocationPress,
  tagLocationLoading,
}: Props) {
  const {
    manualName,
    setManualName,
    manualAddress,
    setManualAddress,
    manualGeotag,
    selectManualAddress,
    backToSearchSelect,
  } = place;
  const { data: categoryRows } = useActiveCategories(true);
  const fieldsEditable = isAndroid || !tagLocationLoading;

  return (
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      automaticallyAdjustKeyboardInsets
      showsVerticalScrollIndicator={false}
      contentContainerClassName={cn('items-center', SCROLL_PAD)}
    >
      <View className={cn(CREATE_REC_STEP_INNER, 'gap-6')}>
        <View className="items-center space-y-2 px-1 pb-2">
          <CreateStepTitle>Add a new place</CreateStepTitle>
          <Text className="text-center text-sm text-muted-foreground">
            Enter the name and address manually
          </Text>
        </View>

        <SearchTextField
          value={manualName}
          onChangeText={setManualName}
          placeholder="Name of place, person, or service"
          autoCapitalize="words"
          editable={fieldsEditable}
        />

        <SearchTextField
          value={manualAddress}
          onChangeText={setManualAddress}
          placeholder="Address or location"
          editable={fieldsEditable}
        />

        <AddressSearchStatus
          errorMessage={addressSearchErrorMessage}
          searching={isSearchingAddress}
          showNoResults={showAddressNoResults}
        />

        {!isSearchingAddress &&
          addressResults.map((place) => (
            <SearchPlaceRow
              key={place.id}
              place={place}
              categoryRows={categoryRows}
              selected={
                manualGeotag?.lat === place.latitude && manualGeotag?.lng === place.longitude
              }
              onSelect={selectManualAddress}
            />
          ))}

        <TagLocationButton
          loading={tagLocationLoading}
          geotag={manualGeotag}
          onPress={onTagLocationPress}
        />

        <Pressable
          onPress={backToSearchSelect}
          className="group -mx-1 self-start rounded-lg px-1 py-2"
          accessibilityRole="button"
          accessibilityLabel="Back to search"
        >
          <View className="flex-row items-center">
            <Text className="text-sm text-muted-foreground group-hover:text-foreground group-active:text-foreground">
              ←{' '}
            </Text>
            <Text className="text-sm text-muted-foreground group-hover:text-foreground group-active:text-foreground">
              Back to search
            </Text>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
}

export default SearchManualPanel;
