import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { CREATE_REC_STEP_INNER } from '~/features/rex-create/config/layout';
import CreateStepTitle from '../../../CreateStepTitle';
import type { UseRexPlaceSearchResult } from '~/features/rex-create/hooks/useRexPlaceSearch';
import type { CreateRecFlow } from '~/features/rex-create/hooks/useCreateRecWizard';
import { SEARCH_MODE } from '~/features/rex-create/types/create';
import AddManualPlaceButton from './AddManualPlaceButton';
import OnlineEntryForm from './OnlineEntryForm';
import OnlinePlaceToggle from './OnlinePlaceToggle';
import SearchQueryField from './SearchQueryField';
import SearchResults from './SearchResults';

type Props = {
  place: CreateRecFlow['place'];
  search: UseRexPlaceSearchResult;
  onTagLocationPress: () => void;
  tagLocationLoading: boolean;
};

function SearchSelectPanel({ place, search, onTagLocationPress, tagLocationLoading }: Props) {
  const onlineSelected = place.searchMode === SEARCH_MODE.online;
  return (
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      automaticallyAdjustKeyboardInsets
      showsVerticalScrollIndicator={false}
      contentContainerClassName="items-center pb-36"
    >
      <View className={CREATE_REC_STEP_INNER}>
        <View className="items-center space-y-2 px-1 pb-2">
          <CreateStepTitle>What are you recommending?</CreateStepTitle>
          <Text className="text-center text-sm text-muted-foreground">
            Search for a place, person, or service
          </Text>
        </View>

        <SearchQueryField
          value={place.searchQuery}
          onChangeText={place.setSearchQuery}
          editable={!onlineSelected}
        />
        <SearchResults place={place} search={search} />
        <AddManualPlaceButton disabled={onlineSelected} onPress={place.openManual} />
        <OnlinePlaceToggle checked={onlineSelected} onChange={place.setOnlinePlaceSelected} />
        <OnlineEntryForm
          place={place}
          tagLocationLoading={tagLocationLoading}
          onTagLocationPress={onTagLocationPress}
        />
      </View>
    </ScrollView>
  );
}

export default SearchSelectPanel;
