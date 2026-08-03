import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MAP_ACTION_INSET } from '~/features/map/config/mapUi';
import { useMapSearchFocus } from '~/features/map/hooks/search/useMapSearchFocus';
import MapSearchField from '~/features/map/ui/search/MapSearchField';
import MapSearchRow from '~/features/map/ui/search/MapSearchRow';
import MapSearchSuggestions from '~/features/map/ui/search/MapSearchSuggestions';
import MapViewModeToggle from '~/features/map/ui/search/MapViewModeToggle';
import type { Recommendation } from '~/shared/types/recommendation';
import { androidElevation } from '~/utils';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  suggestions?: Recommendation[];
  onSelectSuggestion?: (rec: Recommendation) => void;
  listView: boolean;
  onToggleListView: () => void;
};

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: MAP_ACTION_INSET,
    right: MAP_ACTION_INSET,
    top: MAP_ACTION_INSET,
    zIndex: 1300,
  },
});

const MapSearchBar = ({
  value,
  onChangeText,
  suggestions = [],
  onSelectSuggestion,
  listView,
  onToggleListView,
}: Props) => {
  const focus = useMapSearchFocus({
    value,
    suggestions,
    onChangeText,
    onSelectSuggestion,
  });

  return (
    <View pointerEvents="box-none" style={[styles.root, androidElevation(16)]}>
      <MapSearchRow
        field={
          <MapSearchField
            inputRef={focus.inputRef}
            value={value}
            onChangeText={onChangeText}
            onFocus={focus.handleFocus}
            onBlur={focus.handleBlur}
          />
        }
        trailing={<MapViewModeToggle listView={listView} onToggle={onToggleListView} />}
      />

      {focus.showSuggestions && (
        <MapSearchSuggestions suggestions={suggestions} onSelect={focus.pickSuggestion} />
      )}
    </View>
  );
};

export default MapSearchBar;
