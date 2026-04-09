import React, { useMemo } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MapView from 'react-native-maps';
import type { MapMarkerItem } from '~/types/map/mapMarker';
import { regionForMarkers } from '~/utils/map/regionForMarkers';
import { MAP_VIEW_HEIGHT, MAP_VIEW_MIN_HEIGHT } from '~/constants/map/mapUi';
import { NativeMarker } from '~/components/map/common/NativeMarker';

type Props = {
  markers: MapMarkerItem[];
  highlightedId: string | null;
  onMarkerHoverIn: (id: string) => void;
  onMarkerHoverOut: () => void;
  onMarkerPress: (id: string) => void;
};

/** Native map + markers (`react-native-maps`). Web: `MarkerMap.web.tsx`. */
const MarkerMap: React.FC<Props> = ({
  markers,
  highlightedId,
  onMarkerHoverIn,
  onMarkerHoverOut,
  onMarkerPress,
}) => {
  const initialRegion = useMemo(() => regionForMarkers(markers), [markers]);

  return (
    <View
      className="rounded-2xl border border-border overflow-hidden bg-card"
      style={{ height: MAP_VIEW_HEIGHT, minHeight: MAP_VIEW_MIN_HEIGHT }}
    >
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={initialRegion}
        showsPointsOfInterest
        rotateEnabled={false}
        pitchEnabled={false}
        toolbarEnabled={Platform.OS === 'android'}
      >
        {markers.map((m) => (
          <NativeMarker
            key={m.id}
            marker={m}
            active={highlightedId === m.id}
            onHoverIn={onMarkerHoverIn}
            onHoverOut={onMarkerHoverOut}
            onPress={onMarkerPress}
          />
        ))}
      </MapView>
    </View>
  );
};

export default MarkerMap;
