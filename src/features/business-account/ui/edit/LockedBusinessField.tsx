import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Lock } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  label: string;
  value: string | null;
  hint: string;
  onPress?: () => void;
};

function LockedBusinessField({ label, value, hint, onPress }: Props) {
  return (
    <View className="gap-1.5">
      <Text className="text-sm font-medium text-foreground">{label}</Text>
      <TouchableOpacity
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={0.7}
        accessibilityRole={onPress ? 'button' : 'text'}
        accessibilityLabel={`${label}: ${value ?? 'Not available yet'}. ${hint}`}
        className="flex-row items-center gap-3 rounded-lg border border-border bg-muted/40 px-3 py-3"
      >
        <Text
          className={
            value
              ? 'min-w-0 flex-1 text-base text-foreground'
              : 'min-w-0 flex-1 text-base text-muted-foreground'
          }
          numberOfLines={2}
        >
          {value ?? 'Not available yet'}
        </Text>
        <Lock size={16} color={Theme.colors.muted} />
      </TouchableOpacity>
      <Text className="text-xs text-muted-foreground">{hint}</Text>
    </View>
  );
}

export default LockedBusinessField;
