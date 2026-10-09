import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';

function BusinessPageHeaderBar({ onBack }: { onBack: () => void }) {
  return (
    <View className="w-full flex-row items-center justify-between px-4 py-4">
      <TouchableOpacity onPress={onBack} className="flex-row items-center gap-1">
        <ArrowLeft size={16} color={Theme.colors.muted} />
        <Text className="text-sm text-muted-foreground">Back</Text>
      </TouchableOpacity>
      <Text className="text-sm font-semibold text-foreground">Business</Text>
      <View style={{ width: 48 }} />
    </View>
  );
}

export default BusinessPageHeaderBar;
