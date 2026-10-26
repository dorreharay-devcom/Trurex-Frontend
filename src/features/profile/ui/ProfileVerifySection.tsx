import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { VerifiedBadge } from '~/shared/ui/primitives/VerifiedBadge';

type Props = {
  onPress: () => void;
};

function ProfileVerifySection({ onPress }: Props) {
  return (
    <View className="px-4 pb-1 pt-3">
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Get verified"
        className="flex-row items-center gap-3 rounded-xl border border-border bg-background px-4 py-3.5"
      >
        <VerifiedBadge size={28} />
        <View className="min-w-0 flex-1 gap-0.5">
          <Text className="text-sm font-medium text-foreground">Get verified</Text>
          <Text className="text-xs text-muted-foreground">Add the blue badge to your profile</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Text className="text-sm text-foreground">Verify</Text>
          <ChevronRight size={18} color={Theme.colors.muted} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default ProfileVerifySection;
