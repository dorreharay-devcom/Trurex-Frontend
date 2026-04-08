import React, { useCallback, useMemo } from 'react';
import { View, Text } from 'react-native';
import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';
import type { MapMarkerItem } from '~/components/map/mapTypes';

type Props = {
  markers: MapMarkerItem[];
  highlightedId: string | null;
  onMarkerHoverIn: (id: string) => void;
  onMarkerHoverOut: () => void;
  onMarkerPress: (id: string) => void;
};

const MAP_HEIGHT = 440;

const containerStyle = {
  width: '100%',
  height: MAP_HEIGHT,
  minHeight: 360,
  borderRadius: 16,
};

const ORANGE_PIN = 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png';

const INFO_CARD_MAX_W = 320;
const INFO_IMAGE_H = 118;

function getInfoWindowOptions(): google.maps.InfoWindowOptions {
  if (typeof window === 'undefined' || !window.google?.maps) {
    return { maxWidth: INFO_CARD_MAX_W };
  }
  return {
    maxWidth: INFO_CARD_MAX_W,
    pixelOffset: new window.google.maps.Size(0, -22),
  };
}

const RecommendationsMap: React.FC<Props> = ({
  markers,
  highlightedId,
  onMarkerHoverIn,
  onMarkerHoverOut,
  onMarkerPress,
}) => {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

  const center = useMemo(() => {
    if (markers.length === 0) {
      return { lat: 34.05, lng: -118.25 };
    }
    const lats = markers.map((m) => m.latitude);
    const lngs = markers.map((m) => m.longitude);
    return {
      lat: (Math.min(...lats) + Math.max(...lats)) / 2,
      lng: (Math.min(...lngs) + Math.max(...lngs)) / 2,
    };
  }, [markers]);

  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      if (markers.length === 0) return;
      const bounds = new google.maps.LatLngBounds();
      markers.forEach((m) => bounds.extend({ lat: m.latitude, lng: m.longitude }));
      map.fitBounds(bounds, 56);
    },
    [markers],
  );

  if (!apiKey) {
    return (
      <View className="rounded-2xl border border-border h-[440px] min-h-[360px] items-center justify-center bg-muted/20 px-4">
        <Text className="text-sm text-center text-muted-foreground">
          Add EXPO_PUBLIC_GOOGLE_MAPS_API_KEY to your .env to show Google Maps on web.
        </Text>
      </View>
    );
  }

  return (
    <View className="rounded-2xl border border-border overflow-hidden h-[440px] min-h-[360px] bg-card">
      <LoadScript
        googleMapsApiKey={apiKey}
        loadingElement={<View className="h-[440px] min-h-[360px] bg-muted/30" />}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          onLoad={onMapLoad}
          options={{
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: false,
          }}
        >
          {markers.map((m) => (
            <Marker
              key={m.id}
              position={{ lat: m.latitude, lng: m.longitude }}
              icon={ORANGE_PIN}
              zIndex={highlightedId === m.id ? 1000 : 1}
              onMouseOver={() => onMarkerHoverIn(m.id)}
              onMouseOut={onMarkerHoverOut}
              onClick={() => onMarkerPress(m.id)}
            >
              {highlightedId === m.id && (
                <InfoWindow onCloseClick={onMarkerHoverOut} options={getInfoWindowOptions()}>
                  <div
                    className="trurex-map-infowindow-inner"
                    style={{
                      width: '100%',
                      maxWidth: INFO_CARD_MAX_W,
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      margin: 0,
                      padding: 0,
                      alignItems: 'stretch',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        minWidth: 0,
                        flexShrink: 0,
                        paddingRight: 36,
                      }}
                    >
                      <span
                        style={{
                          display: 'block',
                          fontSize: 14,
                          fontWeight: 700,
                          color: '#171717',
                          lineHeight: 1.2,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {m.title}
                      </span>
                      {m.subtitle ? (
                        <span
                          style={{
                            display: 'block',
                            fontSize: 12,
                            fontWeight: 400,
                            color: '#525252',
                            lineHeight: 1.25,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {m.subtitle}
                        </span>
                      ) : null}
                    </div>
                    {m.imageUrl ? (
                      <div
                        style={{
                          width: '100%',
                          height: INFO_IMAGE_H,
                          minHeight: INFO_IMAGE_H,
                          flexShrink: 0,
                          borderRadius: 12,
                          overflow: 'hidden',
                          backgroundColor: '#e5e5e5',
                        }}
                      >
                        <img
                          src={m.imageUrl}
                          alt=""
                          style={{
                            display: 'block',
                            width: '100%',
                            height: INFO_IMAGE_H,
                            minHeight: INFO_IMAGE_H,
                            objectFit: 'cover',
                            margin: 0,
                            padding: 0,
                            borderStyle: 'none',
                          }}
                        />
                      </div>
                    ) : null}
                  </div>
                </InfoWindow>
              )}
            </Marker>
          ))}
        </GoogleMap>
      </LoadScript>
    </View>
  );
};

export default RecommendationsMap;
