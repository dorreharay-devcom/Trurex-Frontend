import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { Marker } from 'react-native-maps';
import { Theme } from '~/theme/Theme';
import type { MapMarkerItem } from '~/types/map/mapMarker';
import { MAP_PIN_GLYPH_COLOR } from '~/types/map/mapPin';
import { nativeMarkerStyles as styles } from '~/components/map/common/nativeMarkerStyles';

type Props = {
  marker: MapMarkerItem;
  selected: boolean;
  onPress: (id: string) => void;
};

const NATIVE_MARKER_TRACKING_MS = 700;

export const NativeMarker: React.FC<Props> = ({ marker: m, selected, onPress }) => {
  const [tracksViewChanges, setTracksViewChanges] = useState(Platform.OS !== 'web');

  useEffect(() => {
    if (Platform.OS === 'web') return;
    setTracksViewChanges(true);
    const timeout = setTimeout(() => setTracksViewChanges(false), NATIVE_MARKER_TRACKING_MS);
    return () => clearTimeout(timeout);
  }, [m.glyph, m.pinColor, selected]);

  return (
    <Marker
      coordinate={{ latitude: m.latitude, longitude: m.longitude }}
      anchor={{ x: 0.5, y: 0.91 }}
      onPress={() => onPress(m.id)}
      tracksViewChanges={tracksViewChanges}
      zIndex={selected ? 10 : 1}
    >
      <Pressable style={styles.markerHit} accessibilityLabel={m.title}>
        <View
          style={[
            styles.pin,
            {
              backgroundColor: m.pinColor,
              borderColor: Theme.colors.card,
              transform: selected ? [{ scale: 1.08 }] : undefined,
            },
          ]}
        >
          <Text style={[styles.glyph, { color: MAP_PIN_GLYPH_COLOR[m.pinType] }]} numberOfLines={1}>
            {m.glyph}
          </Text>
        </View>
      </Pressable>
    </Marker>
  );
};
