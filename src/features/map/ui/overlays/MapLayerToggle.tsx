import React, { useState } from 'react';
import { Layers } from 'lucide-react-native';
import { View, Text, Pressable, Switch } from 'react-native';
import {
  MAP_ACTION_INSET,
  MAP_LAYER_ABOVE_LOCATE,
  MAP_RIGHT_CONTROLS_BOTTOM,
} from '~/features/map/config/mapUi';
import { MAP_PIN_COLOR, MAP_PIN_TYPE } from '~/features/map/config/pins';
import { Theme } from '~/shared/theme/Theme';
import { androidElevation } from '~/utils';
import type { PinVisibility } from '~/features/map/types/mapPin';

type Props = {
  visibility: PinVisibility;
  onChange: (v: PinVisibility) => void;
};

type LayerKey = keyof Pick<PinVisibility, 'network' | 'rex' | 'saved' | 'beenHere'>;

const layerRows: { key: LayerKey; label: string; color: string }[] = [
  { key: MAP_PIN_TYPE.rex, label: 'Rex', color: MAP_PIN_COLOR[MAP_PIN_TYPE.rex] },
  { key: MAP_PIN_TYPE.network, label: 'Trusted Recs', color: MAP_PIN_COLOR[MAP_PIN_TYPE.network] },
  {
    key: MAP_PIN_TYPE.saved,
    label: 'Saved / Want to Go',
    color: MAP_PIN_COLOR[MAP_PIN_TYPE.saved],
  },
  {
    key: MAP_PIN_TYPE.beenHere,
    label: 'Been Here',
    color: MAP_PIN_COLOR[MAP_PIN_TYPE.beenHere],
  },
];

const MapLayerToggle = ({ visibility, onChange }: Props) => {
  const [open, setOpen] = useState(false);

  const toggle = (key: keyof PinVisibility) => {
    onChange({ ...visibility, [key]: !visibility[key] });
  };

  return (
    <View
      className="absolute z-[1100] items-end"
      style={[
        {
          position: 'absolute',
          right: MAP_ACTION_INSET,
          bottom: MAP_RIGHT_CONTROLS_BOTTOM + MAP_LAYER_ABOVE_LOCATE,
          zIndex: 1100,
        },
        androidElevation(12),
      ]}
    >
      {open ? (
        <View className="mb-2 w-52 rounded-xl border border-border bg-card/95 p-3 shadow-md">
          <Text className="mb-1 text-xs font-semibold text-foreground">Pin Layers</Text>
          {layerRows.map((l) => (
            <View key={l.key} className="mb-2 flex-row items-center gap-2">
              <Switch
                value={visibility[l.key]}
                onValueChange={() => toggle(l.key)}
                trackColor={{ false: Theme.colors.border, true: Theme.colors.primary }}
                thumbColor={Theme.colors.white}
              />
              <View
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: l.color }}
              />
              <Text className="flex-1 text-xs text-foreground">{l.label}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <Pressable
        onPress={() => setOpen(!open)}
        className={`h-10 w-10 items-center justify-center rounded-xl border shadow-md ${
          open ? 'border-primary bg-primary' : 'border-border bg-card'
        }`}
        accessibilityRole="button"
        accessibilityLabel="Map layers"
      >
        <Layers size={16} color={open ? Theme.colors.primaryForeground : Theme.colors.foreground} />
      </Pressable>
    </View>
  );
};

export default MapLayerToggle;
