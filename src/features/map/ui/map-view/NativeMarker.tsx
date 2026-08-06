import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Diamond, Star, User, Users } from 'lucide-react-native';
import { Marker } from 'react-native-maps';
import { Text, View } from 'react-native';
import { MAP_PIN_GLYPH_COLOR, MAP_PIN_TYPE } from '~/features/map/config/pins';
import { Theme } from '~/shared/theme/Theme';
import { isAndroid, isIos } from '~/shared/lib/ui/platform';
import { nativeMarkerStyles as styles } from '~/features/map/ui/map-view/nativeMarkerStyles';
import type { MapMarkerItem } from '~/features/map/types/mapMarker';
import type { MapPinType } from '~/features/map/types/mapPin';

type Props = {
  marker: MapMarkerItem;
  active: boolean;
  onPress: (id: string) => void;
};

const MARKER_TRACK_HOLD_MS = isAndroid ? 450 : 1200;

const markerAnchor = isAndroid ? { x: 0.5, y: 0.5 } : { x: 0.5, y: 0.91 };

const AndroidMarkerGlyph = ({ pinType, color }: { pinType: MapPinType; color: string }) => {
  switch (pinType) {
    case MAP_PIN_TYPE.saved:
      return <Star size={17} color={color} fill={color} strokeWidth={2.4} />;
    case MAP_PIN_TYPE.beenHere:
      return <Check size={18} color={color} strokeWidth={3} />;
    case MAP_PIN_TYPE.overlap:
      return <Diamond size={15} color={color} fill={color} strokeWidth={2.4} />;
    case MAP_PIN_TYPE.rex:
      return <User size={17} color={color} strokeWidth={2.6} />;
    case MAP_PIN_TYPE.network:
    default:
      return <Users size={18} color={color} strokeWidth={2.6} />;
  }
};

type MarkerContentProps = {
  marker: MapMarkerItem;
};

const MarkerContent = React.memo(
  function MarkerContent({ marker: m }: MarkerContentProps) {
    const glyphColor = MAP_PIN_GLYPH_COLOR[m.pinType];

    return (
      <View
        collapsable={false}
        style={[
          styles.markerHit,
          isAndroid && styles.androidMarkerHit,
          isIos && styles.iosMarkerHit,
        ]}
        accessibilityLabel={m.title}
      >
        <View
          collapsable={false}
          style={[
            styles.pin,
            isAndroid && styles.androidPin,
            isIos && styles.iosPin,
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

const NativeMarkerComponent = ({ marker: m, active, onPress }: Props) => {
  const [tracksViewChanges, setTracksViewChanges] = useState(true);
  const trackGenRef = useRef(0);

  const coordinate = useMemo(
    () => ({ latitude: m.latitude, longitude: m.longitude }),
    [m.latitude, m.longitude],
  );

  useEffect(() => {
    trackGenRef.current += 1;
    const gen = trackGenRef.current;
    setTracksViewChanges(true);
    const timeout = setTimeout(() => {
      if (trackGenRef.current === gen) setTracksViewChanges(false);
    }, MARKER_TRACK_HOLD_MS);
    return () => clearTimeout(timeout);
  }, [m.glyph, m.pinColor, m.pinType, active, m.clusterCount]);

  return (
    <Marker
      coordinate={coordinate}
      anchor={markerAnchor}
      onPress={() => onPress(m.id)}
      tracksViewChanges={tracksViewChanges}
      zIndex={active ? 10 : 1}
      stopPropagation
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
    prev.pinType === next.pinType &&
    prev.clusterCount === next.clusterCount
  );
}

function areNativeMarkerPropsEqual(prev: Props, next: Props): boolean {
  return (
    prev.active === next.active &&
    prev.onPress === next.onPress &&
    areMarkerVisualPropsEqual(prev.marker, next.marker)
  );
}

const NativeMarker = React.memo(NativeMarkerComponent, areNativeMarkerPropsEqual);

export default NativeMarker;
