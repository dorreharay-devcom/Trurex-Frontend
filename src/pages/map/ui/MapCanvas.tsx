import React from 'react';
import { StyleSheet, View } from 'react-native';
import MarkerMap from '~/features/map/ui/map-view/MarkerMap';
import type { MarkerMapProps } from '~/features/map/types/markerMap';
import { isWeb } from '~/utils';

type Props = MarkerMapProps & {
  hidden: boolean;
};

const MapCanvas = ({ hidden, ...mapProps }: Props) => {
  return (
    <View
      pointerEvents={hidden ? 'none' : 'auto'}
      style={[
        StyleSheet.absoluteFillObject,
        { zIndex: 0, opacity: hidden ? 0 : 1 },
        isWeb ? ({ isolation: 'isolate' } as const) : null,
      ]}
    >
      <View className="h-full w-full flex-1">
        <MarkerMap {...mapProps} />
      </View>
    </View>
  );
};

export default MapCanvas;
