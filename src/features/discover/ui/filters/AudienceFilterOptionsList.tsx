import React from 'react';
import { Text, View } from 'react-native';
import {
  AUDIENCE_FILTER_OPTIONS,
  type AudienceFilterId,
} from '~/features/discover/config/audienceFilters';
import AudienceFilterRow from '~/features/discover/ui/filters/AudienceFilterRow';

type Props = {
  selected: Set<AudienceFilterId>;
  onToggle: (id: AudienceFilterId) => void;
};

function AudienceFilterOptionsList({ selected, onToggle }: Props) {
  return (
    <>
      <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Circles
      </Text>
      <View>
        {AUDIENCE_FILTER_OPTIONS.map((option) => (
          <AudienceFilterRow
            key={option.id}
            label={option.label}
            selected={selected.has(option.id)}
            onToggle={() => onToggle(option.id)}
          />
        ))}
      </View>
    </>
  );
}

export default AudienceFilterOptionsList;
