import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { isWeb } from '~/shared/lib/ui/platform';

function BusinessPageHeaderBar({ onBack }: { onBack: () => void }) {
  return (
    <View
      className="sticky top-0 z-10 border-b border-border bg-card/95 px-4 py-4 backdrop-blur sm:px-6"
      style={!isWeb ? { position: 'relative', zIndex: 50, elevation: 50 } : undefined}
    >
      <View className="flex-row items-center">
        <Pressable
          onPress={onBack}
          className="z-10 flex-row items-center gap-1.5 rounded-lg py-0.5 active:opacity-80"
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ArrowLeft size={20} color={Theme.colors.secondaryText} />
          <Text className="text-sm font-medium text-foreground">Back</Text>
        </Pressable>
        <View className="absolute inset-0 items-center justify-center" pointerEvents="none">
          <Text className="text-sm font-semibold text-foreground">Business Page</Text>
        </View>
      </View>
    </View>
  );
}

export default BusinessPageHeaderBar;
