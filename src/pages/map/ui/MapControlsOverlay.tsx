import React from 'react';
import { LocateFixed } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  MAP_ACTION_BANNER_BOTTOM,
  MAP_ACTION_INSET,
  MAP_RIGHT_CONTROLS_BOTTOM,
} from '~/features/map/config/mapUi';
import MapLayerToggle from '~/features/map/ui/overlays/MapLayerToggle';
import MapLegend from '~/features/map/ui/overlays/MapLegend';
import { Theme } from '~/shared/theme/Theme';
import { isWeb } from '~/shared/lib/ui/platform';
import { androidElevation } from '~/shared/lib/ui/styles';
import type { PinVisibility } from '~/features/map/types/mapPin';

type Props = {
  visible: boolean;
  layers: PinVisibility;
  onLayersChange: (layers: PinVisibility) => void;
  onLocateMe: () => void | Promise<void>;
  isError: boolean;
  onRetry: () => void | Promise<void>;
};

const MapControlsOverlay = ({
  visible,
  layers,
  onLayersChange,
  onLocateMe,
  isError,
  onRetry,
}: Props) => {
  if (!visible) return null;

  return (
    <View
      pointerEvents="box-none"
      style={[StyleSheet.absoluteFillObject, { zIndex: 1100, elevation: 0 }]}
    >
      <MapLegend />
      <MapLayerToggle visibility={layers} onChange={onLayersChange} />

      <Pressable
        onPress={() => void onLocateMe()}
        className="absolute z-[1100] h-10 w-10 items-center justify-center rounded-xl border border-border bg-card shadow-md"
        style={[
          {
            right: MAP_ACTION_INSET,
            bottom: MAP_RIGHT_CONTROLS_BOTTOM,
            zIndex: 1100,
          },
          androidElevation(12),
          isWeb ? ({ cursor: 'pointer' } as const) : null,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Center map on your location"
      >
        <LocateFixed size={16} color={Theme.colors.foreground} />
      </Pressable>

      {isError && (
        <View
          className="absolute z-[1000]"
          style={{
            left: MAP_ACTION_INSET,
            right: MAP_ACTION_INSET,
            bottom: MAP_ACTION_BANNER_BOTTOM,
          }}
        >
          <View className="rounded-2xl border border-border bg-card/95 p-4 text-center shadow-md">
            <Text className="text-sm font-medium text-foreground">Couldn&apos;t load map data</Text>
            <Pressable
              onPress={() => void onRetry()}
              className="mt-2 self-center rounded-xl bg-primary px-4 py-2"
            >
              <Text className="text-xs font-medium text-primary-foreground">Retry</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

export default MapControlsOverlay;
