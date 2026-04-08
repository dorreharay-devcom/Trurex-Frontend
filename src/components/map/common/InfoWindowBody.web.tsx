import React from 'react';
import { View, Text, Image } from 'react-native';
import { Theme } from '~/theme/Theme';
import { WEB_INFO_CARD_MAX_W, WEB_INFO_IMAGE_H } from '~/constants/map/mapUi';
import type { MapMarkerItem } from '~/types/map/mapMarker';

type Props = {
  marker: MapMarkerItem;
};

/** Matches native marker tooltip: title/subtitle, then image. */
export const InfoWindowBody: React.FC<Props> = ({ marker: m }) => (
  <View
    style={{
      width: '100%',
      maxWidth: WEB_INFO_CARD_MAX_W,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      margin: 0,
      padding: 0,
      alignItems: 'stretch',
    }}
  >
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minWidth: 0,
        flexShrink: 0,
        paddingRight: 36,
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: '700',
          color: Theme.colors.foreground,
        }}
        numberOfLines={1}
      >
        {m.title}
      </Text>
      {m.subtitle ? (
        <Text style={{ fontSize: 12, color: Theme.colors.secondaryText }} numberOfLines={1}>
          {m.subtitle}
        </Text>
      ) : null}
    </View>
    {m.imageUrl ? (
      <View
        style={{
          width: '100%',
          height: WEB_INFO_IMAGE_H,
          minHeight: WEB_INFO_IMAGE_H,
          flexShrink: 0,
          borderRadius: 12,
          overflow: 'hidden',
          backgroundColor: Theme.colors.border,
        }}
      >
        <Image
          source={{ uri: m.imageUrl }}
          style={{ width: '100%', height: WEB_INFO_IMAGE_H }}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
      </View>
    ) : null}
  </View>
);
