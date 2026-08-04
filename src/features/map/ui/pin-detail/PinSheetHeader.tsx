import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { X } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import type { Recommendation } from '~/shared/types/recommendation';

type Props = {
  pin: Recommendation;
  distanceLabel?: string;
  onClose: () => void;
};

const PinSheetHeader = ({ pin, distanceLabel, onClose }: Props) => {
  const categoryIcon = pin.categoryIcon?.trim();

  return (
    <View className="mb-3 flex-row items-start justify-between">
      <View className="min-w-0 flex-1 pr-2">
        <View className="mb-1 flex-row items-center gap-2">
          {categoryIcon && (
            <View className="h-6 w-6 items-center justify-center overflow-visible">
              <Text style={{ fontSize: 16, lineHeight: 22 }}>{categoryIcon}</Text>
            </View>
          )}
          <Text className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {pin.category}
          </Text>
        </View>
        <Text className="font-display text-base font-bold text-foreground" numberOfLines={2}>
          {pin.title}
        </Text>
        {pin.location && (
          <Text className="mt-0.5 text-xs text-muted-foreground">
            📍 {pin.location}
            {distanceLabel ? ` · ${distanceLabel}` : ''}
          </Text>
        )}
      </View>
      <Pressable
        onPress={onClose}
        className="rounded-lg p-1.5 active:bg-muted/30"
        accessibilityRole="button"
        accessibilityLabel="Close"
      >
        <X size={16} color={Theme.colors.secondaryText} />
      </Pressable>
    </View>
  );
};

export default PinSheetHeader;
