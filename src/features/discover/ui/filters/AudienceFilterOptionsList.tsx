import React from 'react';
import { Text, View } from 'react-native';
import AudienceFilterRow from '~/features/discover/ui/filters/AudienceFilterRow';

type Props<T extends string> = {
  selected: readonly T[];
  onSelect: (id: T) => void;
  options: readonly { id: T; label: string }[];
  sectionLabel?: string;
};

function AudienceFilterOptionsList<T extends string>({
  selected,
  onSelect,
  options,
  sectionLabel = 'Circles',
}: Props<T>) {
  return (
    <>
      <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {sectionLabel}
      </Text>
      <View>
        {options.map((option) => (
          <AudienceFilterRow
            key={option.id}
            label={option.label}
            selected={selected.includes(option.id)}
            onPress={() => onSelect(option.id)}
          />
        ))}
      </View>
    </>
  );
}

export default AudienceFilterOptionsList;
