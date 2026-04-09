import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Marker } from 'react-native-maps';
import { MapPin } from 'lucide-react-native';
import { Theme } from '~/theme/Theme';
import type { MapMarkerItem } from '~/types/map/mapMarker';
import { nativeMarkerStyles as styles } from '~/components/map/common/nativeMarkerStyles';

type Props = {
  marker: MapMarkerItem;
  active: boolean;
  onHoverIn: (id: string) => void;
  onHoverOut: () => void;
  onPress: (id: string) => void;
};

export const NativeMarker: React.FC<Props> = ({
  marker: m,
  active,
  onHoverIn,
  onHoverOut,
  onPress,
}) => (
  <Marker
    coordinate={{ latitude: m.latitude, longitude: m.longitude }}
    anchor={{ x: 0.5, y: 1 }}
    onPress={() => onPress(m.id)}
    tracksViewChanges={false}
  >
    <Pressable onHoverIn={() => onHoverIn(m.id)} onHoverOut={onHoverOut} style={styles.markerHit}>
      {active ? (
        <View style={[styles.tooltip, { borderColor: Theme.colors.border }]}>
          <View style={styles.tooltipTextBlock}>
            <Text style={styles.tooltipTitle} numberOfLines={1}>
              {m.title}
            </Text>
            {m.subtitle ? (
              <Text style={styles.tooltipSub} numberOfLines={1}>
                {m.subtitle}
              </Text>
            ) : null}
          </View>
          {m.imageUrl ? (
            <Image
              source={{ uri: m.imageUrl }}
              style={styles.tooltipImage}
              resizeMode="cover"
              accessibilityIgnoresInvertColors
            />
          ) : null}
        </View>
      ) : null}
      <View
        style={[
          styles.pin,
          active && {
            transform: [{ scale: 1.06 }],
            borderColor: Theme.colors.accentForeground,
          },
        ]}
      >
        <MapPin size={16} color={Theme.colors.primaryForeground} />
      </View>
    </Pressable>
  </Marker>
);
