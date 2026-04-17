import React from 'react';
import { Modal, View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin } from 'lucide-react-native';
import { Theme } from '~/theme/Theme';

type Props = {
  visible: boolean;
  onAllow: () => void;
  onNotNow: () => void;
};

export const MapLocationPermissionModal: React.FC<Props> = ({ visible, onAllow, onNotNow }) => {
  const insets = useSafeAreaInsets();

  /** Push the sheet down so it clears status bar / app chrome. PaddingTop on a justify-end parent does not move the child. */
  const sheetTopNudge = Math.max(insets.top, 12) + (Platform.OS === 'web' ? 64 : 16);
  const bottomBase = Math.max(insets.bottom, 16) + 20;
  const paddingBottom = bottomBase + sheetTopNudge;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      presentationStyle={Platform.OS === 'ios' ? 'overFullScreen' : undefined}
      statusBarTranslucent={Platform.OS === 'android'}
      onRequestClose={onNotNow}
    >
      <View
        className="bg-black/45 px-4"
        style={[
          StyleSheet.absoluteFillObject,
          {
            justifyContent: 'flex-end',
            paddingBottom,
            ...(Platform.OS === 'web'
              ? ({ zIndex: 20_000, isolation: 'isolate' } as const)
              : null),
          },
        ]}
      >
        <View
          className="w-full max-w-md self-center overflow-visible rounded-2xl border border-border bg-card px-5 pb-6 pt-5 shadow-xl"
          style={{ transform: [{ translateY: sheetTopNudge }] }}
        >
          <View className="mb-3 flex-row items-center gap-2">
            <MapPin size={22} color={Theme.colors.destructive} />
            <Text className="text-base font-semibold text-foreground">Enable Location</Text>
          </View>
          <Text className="mb-6 text-sm leading-relaxed" style={{ color: Theme.colors.secondaryText }}>
            TruRex uses your location to show recommendations near you. Allow location access to get
            the most from the map.
          </Text>
          <View className="flex-row gap-3">
            <Pressable
              onPress={onAllow}
              className="flex-1 items-center rounded-full py-3.5"
              style={{ backgroundColor: Theme.colors.primary }}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: Theme.colors.primaryForeground }}
              >
                Allow
              </Text>
            </Pressable>
            <Pressable
              onPress={onNotNow}
              className="flex-1 items-center rounded-full border border-border bg-card py-3.5"
            >
              <Text className="text-sm font-semibold text-foreground">Not Now</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};
