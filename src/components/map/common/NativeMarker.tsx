import React, { useEffect, useState } from 'react';
import { View, Text, Platform } from 'react-native';
import { Marker } from 'react-native-maps';
import { Theme } from '~/theme/Theme';
import type { MapMarkerItem } from '~/types/map/mapMarker';
import { MAP_PIN_GLYPH_COLOR } from '~/types/map/mapPin';
import { nativeMarkerStyles as styles } from '~/components/map/common/nativeMarkerStyles';

type Props = {
  marker: MapMarkerItem;
  active: boolean;
  onPress: (id: string) => void;
};

const NATIVE_MARKER_TRACKING_MS = 700;

const markerAnchor = Platform.OS === 'android' ? { x: 0.5, y: 0.5 } : { x: 0.5, y: 0.91 };

type MarkerContentProps = {
  marker: MapMarkerItem;
};

const MarkerContent = React.memo(
  function MarkerContent({ marker: m }: MarkerContentProps) {
    return (
      <View style={styles.markerHit} accessibilityLabel={m.title}>
        <View
          style={[
            styles.pin,
            {
              backgroundColor: m.pinColor,
              borderColor: Theme.colors.card,
            },
          ]}
        >
          <Text style={[styles.glyph, { color: MAP_PIN_GLYPH_COLOR[m.pinType] }]} numberOfLines={1}>
            {m.glyph}
          </Text>
        </View>
      </View>
    );
  },
  (prev, next) => areMarkerVisualPropsEqual(prev.marker, next.marker),
);

const NativeMarkerComponent: React.FC<Props> = ({ marker: m, active, onPress }) => {
  const [tracksViewChanges, setTracksViewChanges] = useState(Platform.OS !== 'web');

  useEffect(() => {
    if (Platform.OS === 'web') return;
    const timeout = setTimeout(() => setTracksViewChanges(false), NATIVE_MARKER_TRACKING_MS);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    setTracksViewChanges(true);
    const timeout = setTimeout(() => setTracksViewChanges(false), NATIVE_MARKER_TRACKING_MS);
    return () => clearTimeout(timeout);
  }, [m.glyph, m.pinColor]);

  return (
    <Marker
      coordinate={{ latitude: m.latitude, longitude: m.longitude }}
      anchor={markerAnchor}
      onPress={() => onPress(m.id)}
      tracksViewChanges={tracksViewChanges}
      zIndex={active ? 10 : 1}
    >
      <MarkerContent marker={m} />
    </Marker>
  );
};

function areMarkerVisualPropsEqual(prev: MapMarkerItem, next: MapMarkerItem): boolean {
  return (
    prev.id === next.id &&
    prev.latitude === next.latitude &&
    prev.longitude === next.longitude &&
    prev.title === next.title &&
    prev.glyph === next.glyph &&
    prev.pinColor === next.pinColor &&
    prev.pinType === next.pinType
  );
}

function areNativeMarkerPropsEqual(prev: Props, next: Props): boolean {
  return prev.active === next.active && areMarkerVisualPropsEqual(prev.marker, next.marker);
}

export const NativeMarker = React.memo(NativeMarkerComponent, areNativeMarkerPropsEqual);
