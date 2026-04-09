import React, { useCallback, useMemo } from 'react';
import { View, Text } from 'react-native';
import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';
import type { MapMarkerItem } from '~/types/map/mapMarker';
import {
  MAP_VIEW_HEIGHT,
  MAP_VIEW_MIN_HEIGHT,
  WEB_INFO_CARD_MAX_W,
  GOOGLE_ORANGE_PIN_ICON,
} from '~/constants/map/mapUi';
import {
  googleCenterFromMarkers,
  createFitBoundsHandler,
  getInfoWindowOptions,
} from '~/utils/map/webMapCamera';
import { InfoWindowBody } from '~/components/map/common/InfoWindowBody.web';

type Props = {
  markers: MapMarkerItem[];
  highlightedId: string | null;
  onMarkerHoverIn: (id: string) => void;
  onMarkerHoverOut: () => void;
  onMarkerPress: (id: string) => void;
};

const containerStyle = {
  width: '100%',
  height: MAP_VIEW_HEIGHT,
  minHeight: MAP_VIEW_MIN_HEIGHT,
  borderRadius: 16,
};

/** Web: Google Maps + markers + info windows. Props match native `MarkerMap`. */
const MarkerMap: React.FC<Props> = ({
  markers,
  highlightedId,
  onMarkerHoverIn,
  onMarkerHoverOut,
  onMarkerPress,
}) => {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

  const center = useMemo(() => googleCenterFromMarkers(markers), [markers]);

  const fitBounds = useMemo(() => createFitBoundsHandler(markers), [markers]);
  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      fitBounds(map);
    },
    [fitBounds],
  );

  if (!apiKey) {
    return (
      <View
        className="rounded-2xl border border-border items-center justify-center bg-muted/20 px-4"
        style={{ height: MAP_VIEW_HEIGHT, minHeight: MAP_VIEW_MIN_HEIGHT }}
      >
        <Text className="text-sm text-center text-muted-foreground">
          Add EXPO_PUBLIC_GOOGLE_MAPS_API_KEY to your .env to show Google Maps on web.
        </Text>
      </View>
    );
  }

  return (
    <View
      className="rounded-2xl border border-border overflow-hidden bg-card"
      style={{ height: MAP_VIEW_HEIGHT, minHeight: MAP_VIEW_MIN_HEIGHT }}
    >
      <LoadScript
        googleMapsApiKey={apiKey}
        loadingElement={
          <View
            className="bg-muted/30"
            style={{ height: MAP_VIEW_HEIGHT, minHeight: MAP_VIEW_MIN_HEIGHT }}
          />
        }
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
              icon={GOOGLE_ORANGE_PIN_ICON}
              zIndex={highlightedId === m.id ? 1000 : 1}
              onMouseOver={() => onMarkerHoverIn(m.id)}
              onMouseOut={onMarkerHoverOut}
              onClick={() => onMarkerPress(m.id)}
            >
              {highlightedId === m.id && (
                <InfoWindow
                  onCloseClick={onMarkerHoverOut}
                  options={getInfoWindowOptions(WEB_INFO_CARD_MAX_W)}
                >
                  <div className="trurex-map-infowindow-inner">
                    <InfoWindowBody marker={m} />
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

export default MarkerMap;
