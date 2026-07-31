import React from 'react';
import { Text, View } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';

function LocationStat({ location }: { location: string | null | undefined }) {
  if (!location) return null;

  return (
    <View className="min-w-0 flex-1 flex-row items-center gap-0.5 overflow-hidden">
      <MapPin size={10} color={Theme.colors.muted} style={{ flexShrink: 0 }} />
      <Text
        className="min-w-0 flex-1 text-[11px] text-muted-foreground"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {location}
      </Text>
    </View>
  );
}

export default LocationStat;
