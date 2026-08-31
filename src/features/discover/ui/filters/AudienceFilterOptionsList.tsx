import React from 'react';
import { Text, View } from 'react-native';
import {
  AUDIENCE_FILTER_OPTIONS,
  type AudienceFilterId,
} from '~/features/discover/config/audienceFilters';
import AudienceFilterRow from '~/features/discover/ui/filters/AudienceFilterRow';

type Props = {
  selected: AudienceFilterId | null;
  onSelect: (id: AudienceFilterId) => void;
  options?: readonly { id: AudienceFilterId; label: string }[];
};

function AudienceFilterOptionsList({
  selected,
  onSelect,
  options = AUDIENCE_FILTER_OPTIONS,
}: Props) {
  return (
    <>
      <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Circles
      </Text>
      <View>
        {options.map((option) => (
          <AudienceFilterRow
            key={option.id}
            label={option.label}
            selected={selected === option.id}
            onPress={() => onSelect(option.id)}
          />
        ))}
      </View>
    </>
  );
}

export default AudienceFilterOptionsList;
