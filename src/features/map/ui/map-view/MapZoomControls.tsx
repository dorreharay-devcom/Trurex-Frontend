import React from 'react';
import { Pressable, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { MAP_ACTION_INSET, MAP_ZOOM_CONTROLS_BOTTOM } from '~/features/map/config/mapUi';
import { Theme } from '~/shared/theme/Theme';
import { androidElevation } from '~/utils';

type Props = {
  onZoomIn: () => void;
  onZoomOut: () => void;
};

const MapZoomControls = ({ onZoomIn, onZoomOut }: Props) => {
  return (
    <View
      pointerEvents="box-none"
      className="absolute z-[1150] flex-col gap-1.5"
      style={[{ right: MAP_ACTION_INSET, bottom: MAP_ZOOM_CONTROLS_BOTTOM }, androidElevation(14)]}
    >
      <Pressable
        onPress={onZoomIn}
        className="h-10 w-10 items-center justify-center rounded-xl border border-border bg-card shadow-md active:opacity-90"
        accessibilityRole="button"
        accessibilityLabel="Zoom in"
      >
        <Plus size={18} color={Theme.colors.foreground} />
      </Pressable>
      <Pressable
        onPress={onZoomOut}
        className="h-10 w-10 items-center justify-center rounded-xl border border-border bg-card shadow-md active:opacity-90"
        accessibilityRole="button"
        accessibilityLabel="Zoom out"
      >
        <Minus size={18} color={Theme.colors.foreground} />
      </Pressable>
    </View>
  );
};

export default MapZoomControls;
