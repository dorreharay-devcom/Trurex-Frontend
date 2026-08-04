import React from 'react';
import { Pressable } from 'react-native';
import { List, MapPin } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  listView: boolean;
  onToggle: () => void;
};

const MapViewModeToggle = ({ listView, onToggle }: Props) => {
  return (
    <Pressable
      onPress={onToggle}
      className="h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/95 shadow-md"
      accessibilityRole="button"
      accessibilityLabel={listView ? 'Show map' : 'Show list'}
    >
      {listView ? (
        <MapPin size={16} color={Theme.colors.foreground} />
      ) : (
        <List size={16} color={Theme.colors.foreground} />
      )}
    </Pressable>
  );
};

export default MapViewModeToggle;
