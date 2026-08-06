import React, { memo, useCallback, useMemo } from 'react';
import { Marker } from '@react-google-maps/api';
import { createWebMapPinIconUrl } from '~/features/map/lib/webMapCamera';
import type { MapMarkerItem } from '~/features/map/types/mapMarker';

type Props = {
  marker: MapMarkerItem;
  selected: boolean;
  onPress: (id: string) => void;
};

function WebMapMarkerComponent({ marker, selected, onPress }: Props) {
  const { id, latitude, longitude, pinType, pinColor, glyph } = marker;

  const position = useMemo(() => ({ lat: latitude, lng: longitude }), [latitude, longitude]);

  const icon = useMemo(
    () => ({ url: createWebMapPinIconUrl({ pinType, pinColor, glyph }) }),
    [pinType, pinColor, glyph],
  );

  const handleClick = useCallback(() => {
    onPress(id);
  }, [onPress, id]);

  return (
    <Marker
      position={position}
      icon={icon}
      zIndex={selected ? 1000 : 1}
      onClick={handleClick}
      clickable
    />
  );
}

function areEqual(prev: Props, next: Props): boolean {
  return (
    prev.selected === next.selected &&
    prev.onPress === next.onPress &&
    prev.marker.id === next.marker.id &&
    prev.marker.latitude === next.marker.latitude &&
    prev.marker.longitude === next.marker.longitude &&
    prev.marker.pinType === next.marker.pinType &&
    prev.marker.pinColor === next.marker.pinColor &&
    prev.marker.glyph === next.marker.glyph
  );
}

const WebMapMarker = memo(WebMapMarkerComponent, areEqual);

export default WebMapMarker;
