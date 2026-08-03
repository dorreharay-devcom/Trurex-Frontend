import React from 'react';
import { View } from 'react-native';
import type { CreateRecFlow } from '~/features/rex-create/hooks/useCreateRecWizard';
import { SEARCH_MODE } from '~/features/rex-create/types/create';
import { isAndroid } from '~/shared/lib/ui/platform';
import SearchTextField from './SearchTextField';
import TagLocationButton from './TagLocationButton';

type Props = {
  place: CreateRecFlow['place'];
  tagLocationLoading: boolean;
  onTagLocationPress: () => void;
};

function OnlineEntryForm({ place, tagLocationLoading, onTagLocationPress }: Props) {
  if (place.searchMode !== SEARCH_MODE.online) return null;
  return (
    <View className="mb-2 w-full gap-3">
      <SearchTextField
        value={place.onlineName}
        onChangeText={place.setOnlineName}
        placeholder="Name…"
        autoCapitalize="words"
      />
      <SearchTextField
        value={place.onlineWebsiteUrl}
        onChangeText={place.setOnlineWebsiteUrl}
        placeholder="Link to site (optional)"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        textContentType="URL"
      />
      <SearchTextField
        value={place.onlineLocationText}
        onChangeText={place.setOnlineLocationText}
        placeholder="Address or location (optional)"
        editable={isAndroid || !tagLocationLoading}
      />
      <TagLocationButton
        loading={tagLocationLoading}
        geotag={place.onlineGeotag}
        onPress={onTagLocationPress}
      />
    </View>
  );
}

export default OnlineEntryForm;
