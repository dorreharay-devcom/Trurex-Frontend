import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import type { Geotag } from '~/types/recommendation/create';

type Props = {
  loading: boolean;
  geotag: Geotag | null;
  onPress: () => void;
};

function TagLocationButton({ loading, geotag, onPress }: Props) {
  if (loading) {
    return (
      <View className="w-full flex-row items-center gap-2 rounded-lg py-2">
        <ActivityIndicator size="small" color={Theme.colors.primary} />
        <Text className="text-sm text-muted-foreground">Getting your location…</Text>
      </View>
    );
  }
  return (
    <Pressable
      onPress={onPress}
      className="w-full flex-row items-center gap-1.5 rounded-lg py-2 active:opacity-90"
      accessibilityRole="button"
      accessibilityLabel={geotag ? 'Update geotagged location' : 'Tag current location'}
    >
      <MapPin size={18} color={Theme.colors.secondaryText} />
      <Text className="text-sm text-muted-foreground">
        {geotag
          ? `Geotagged (${geotag.lat.toFixed(4)}, ${geotag.lng.toFixed(4)})`
          : 'Tag current location'}
      </Text>
    </Pressable>
  );
}

export default TagLocationButton;
