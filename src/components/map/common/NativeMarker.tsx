import React, { useEffect, useState } from 'react';
import { View, Text, Platform } from 'react-native';
import { Marker } from 'react-native-maps';
import { Check, Diamond, Star, User, Users } from 'lucide-react-native';
import { Theme } from '~/theme/Theme';
import type { MapMarkerItem } from '~/types/map/mapMarker';
import type { MapPinType } from '~/types/map/mapPin';
import { MAP_PIN_GLYPH_COLOR } from '~/types/map/mapPin';
import { nativeMarkerStyles as styles } from '~/components/map/common/nativeMarkerStyles';

type Props = {
  marker: MapMarkerItem;
  active: boolean;
  onPress: (id: string) => void;
};

const NATIVE_MARKER_TRACKING_MS = 700;
const ANDROID_MARKER_TRACKING_MS = 1500;

const markerAnchor = Platform.OS === 'android' ? { x: 0.5, y: 0.5 } : { x: 0.5, y: 0.91 };
const isAndroid = Platform.OS === 'android';

function AndroidMarkerGlyph({ pinType, color }: { pinType: MapPinType; color: string }) {
  switch (pinType) {
    case 'saved':
      return <Star size={17} color={color} fill={color} strokeWidth={2.4} />;
    case 'beenHere':
      return <Check size={18} color={color} strokeWidth={3} />;
    case 'overlap':
      return <Diamond size={15} color={color} fill={color} strokeWidth={2.4} />;
    case 'rex':
      return <User size={17} color={color} strokeWidth={2.6} />;
    case 'network':
    default:
      return <Users size={18} color={color} strokeWidth={2.6} />;
  }
}

type MarkerContentProps = {
  marker: MapMarkerItem;
};

const MarkerContent = React.memo(
  function MarkerContent({ marker: m }: MarkerContentProps) {
    const glyphColor = MAP_PIN_GLYPH_COLOR[m.pinType];

    return (
      <View
        collapsable={false}
        style={[styles.markerHit, isAndroid && styles.androidMarkerHit]}
        accessibilityLabel={m.title}
      >
        <View
          collapsable={false}
          style={[
            styles.pin,
            isAndroid && styles.androidPin,
            {
              backgroundColor: m.pinColor,
              borderColor: Theme.colors.card,
            },
          ]}
        >
          {isAndroid ? (
            <AndroidMarkerGlyph pinType={m.pinType} color={glyphColor} />
          ) : (
            <Text style={[styles.glyph, { color: glyphColor }]} numberOfLines={1}>
              {m.glyph}
            </Text>
          )}
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
    const timeout = setTimeout(() => setTracksViewChanges(false), ANDROID_MARKER_TRACKING_MS);
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
