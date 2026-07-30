import React from 'react';
import { View } from 'react-native';
import { Theme } from '~/shared/theme/Theme';

type Props = { selected: boolean };

export function CircleRadioIndicator({ selected }: Props) {
  return (
    <View
      className="h-5 w-5 items-center justify-center rounded-full border-2"
      style={{
        borderColor: selected ? Theme.colors.primary : Theme.colors.border,
        backgroundColor: selected ? Theme.colors.primary : 'transparent',
      }}
    >
      {selected ? (
        <View
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: Theme.colors.primaryForeground }}
        />
      ) : null}
    </View>
  );
}
