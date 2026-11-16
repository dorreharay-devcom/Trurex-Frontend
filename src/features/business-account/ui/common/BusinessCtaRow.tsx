import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight, Store } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  title: string;
  subtitle: string;
  actionLabel: string;
  onPress: () => void;
};

function BusinessCtaRow({ title, subtitle, actionLabel, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={subtitle}
      className="flex-row items-center gap-3 rounded-xl border border-border bg-background px-4 py-3.5"
    >
      <View className="h-7 w-7 items-center justify-center rounded-full bg-accent">
        <Store size={16} color={Theme.colors.accentForeground} />
      </View>
      <View className="min-w-0 flex-1 gap-0.5">
        <Text className="text-sm font-medium text-foreground">{title}</Text>
        <Text className="text-xs text-muted-foreground">{subtitle}</Text>
      </View>
      <View className="flex-row items-center gap-1">
        <Text className="text-sm text-foreground">{actionLabel}</Text>
        <ChevronRight size={18} color={Theme.colors.muted} />
      </View>
    </TouchableOpacity>
  );
}

export default BusinessCtaRow;
