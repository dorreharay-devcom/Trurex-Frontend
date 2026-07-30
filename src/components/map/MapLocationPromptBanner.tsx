import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { Theme } from '~/shared/theme/Theme';
import { MAP_ACTION_INSET, MAP_LOCATION_PROMPT_TOP } from '~/constants/map/mapUi';

type Props = {
  visible: boolean;
  onAllow: () => void;
  onNotNow: () => void;
};

export const MapLocationPromptBanner: React.FC<Props> = ({ visible, onAllow, onNotNow }) => {
  if (!visible) return null;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: MAP_ACTION_INSET,
        right: MAP_ACTION_INSET,
        top: MAP_LOCATION_PROMPT_TOP,
        zIndex: 1280,
        elevation: Platform.OS === 'android' ? 15 : 0,
      }}
    >
      <View className="rounded-2xl border border-border bg-card p-4 shadow-md">
        <View className="mb-2 flex-row items-center gap-2">
          <View className="h-6 w-5 items-center justify-center overflow-visible">
            <Text
              accessible={false}
              className="text-[17px]"
              style={Platform.OS === 'ios' ? { lineHeight: 22 } : undefined}
            >
              📍
            </Text>
          </View>
          <Text className="text-sm font-semibold text-foreground">Enable Location</Text>
        </View>
        <Text
          className="mb-3 text-xs leading-relaxed"
          style={{ color: Theme.colors.secondaryText }}
        >
          TruRex uses your location to show recommendations near you. Allow location access to get
          the most from the map.
        </Text>
        <View className="flex-row gap-2">
          <Pressable
            onPress={onAllow}
            className="flex-1 items-center rounded-full py-2.5"
            style={{ backgroundColor: Theme.colors.primary }}
            accessibilityRole="button"
            accessibilityLabel="Allow location access"
          >
            <Text
              className="text-xs font-semibold"
              style={{ color: Theme.colors.primaryForeground }}
            >
              Allow
            </Text>
          </Pressable>
          <Pressable
            onPress={onNotNow}
            className="flex-1 items-center rounded-full border border-border bg-card py-2.5"
            accessibilityRole="button"
            accessibilityLabel="Dismiss location prompt"
          >
            <Text className="text-xs font-semibold text-foreground">Not Now</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
