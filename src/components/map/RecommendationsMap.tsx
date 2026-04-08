import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, Platform, Image } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { MapPin } from 'lucide-react-native';
import { Theme } from '~/theme/Theme';
import type { MapMarkerItem } from '~/components/map/mapTypes';

type Props = {
  markers: MapMarkerItem[];
  highlightedId: string | null;
  onMarkerHoverIn: (id: string) => void;
  onMarkerHoverOut: () => void;
  onMarkerPress: (id: string) => void;
};

function regionForMarkers(markers: MapMarkerItem[]): Region {
  if (markers.length === 0) {
    return {
      latitude: 34.05,
      longitude: -118.25,
      latitudeDelta: 8,
      longitudeDelta: 8,
    };
  }
  const lats = markers.map((m) => m.latitude);
  const lngs = markers.map((m) => m.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const midLat = (minLat + maxLat) / 2;
  const midLng = (minLng + maxLng) / 2;
  const pad = 0.02;
  const latDelta = Math.max(maxLat - minLat + pad * 2, 0.08);
  const lngDelta = Math.max(maxLng - minLng + pad * 2, 0.08);
  return {
    latitude: midLat,
    longitude: midLng,
    latitudeDelta: latDelta,
    longitudeDelta: lngDelta,
  };
}

const RecommendationsMap: React.FC<Props> = ({
  markers,
  highlightedId,
  onMarkerHoverIn,
  onMarkerHoverOut,
  onMarkerPress,
}) => {
  const initialRegion = useMemo(() => regionForMarkers(markers), [markers]);

  return (
    <View className="rounded-2xl border border-border overflow-hidden h-[440px] min-h-[360px] bg-card">
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={initialRegion}
        showsPointsOfInterest
        rotateEnabled={false}
        pitchEnabled={false}
        toolbarEnabled={Platform.OS === 'android'}
      >
        {markers.map((m) => {
          const active = highlightedId === m.id;
          return (
            <Marker
              key={m.id}
              coordinate={{ latitude: m.latitude, longitude: m.longitude }}
              anchor={{ x: 0.5, y: 1 }}
              onPress={() => onMarkerPress(m.id)}
              tracksViewChanges={false}
            >
              <Pressable
                onHoverIn={() => onMarkerHoverIn(m.id)}
                onHoverOut={onMarkerHoverOut}
                style={styles.markerHit}
              >
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
        })}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  markerHit: {
    alignItems: 'center',
  },
  tooltipImage: {
    width: 300,
    height: 118,
    borderRadius: 12,
    marginTop: 0,
    backgroundColor: Theme.colors.border,
  },
  tooltip: {
    marginBottom: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    maxWidth: 320,
    backgroundColor: Theme.colors.card,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    gap: 6,
  },
  tooltipTextBlock: {
    gap: 2,
    minWidth: 0,
    marginBottom: 0,
  },
  tooltipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.foreground,
  },
  tooltipSub: {
    fontSize: 12,
    marginTop: 0,
    color: Theme.colors.secondaryText,
  },
  pin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Theme.colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default RecommendationsMap;
