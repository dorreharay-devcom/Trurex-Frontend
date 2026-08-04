import React from 'react';
import { Pressable, View } from 'react-native';
import { CIRCLE_COLOR_PRESETS } from '~/shared/config/circles';
import { Theme } from '~/shared/theme/Theme';

const SELECTED_BORDER_WIDTH = 3;

type Props = {
  selected: string;
  onSelect: (hex: string) => void;
};

const CircleColorPicker = ({ selected, onSelect }: Props) => {
  return (
    <View className="flex-row flex-wrap gap-2">
      {CIRCLE_COLOR_PRESETS.map((hex) => (
        <Pressable
          key={hex}
          onPress={() => onSelect(hex)}
          className="h-7 w-7 rounded-full"
          style={{
            backgroundColor: hex,
            borderWidth: hex === selected ? SELECTED_BORDER_WIDTH : 0,
            borderColor: Theme.colors.foreground,
          }}
        />
      ))}
    </View>
  );
};

export default CircleColorPicker;
