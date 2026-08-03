import React, { type ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { cn } from '~/shared/lib/ui/styles';

type Props = {
  thumbnail: ReactNode;
  title: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
};

function SelectableSheetRow({ thumbnail, title, subtitle, selected, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={selected ? { backgroundColor: Theme.colors.accent } : undefined}
      className="w-full flex-row items-center gap-3 rounded-xl p-3"
    >
      {thumbnail}
      <View className="flex-1 min-w-0">
        <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
          {title}
        </Text>
        <Text
          className={cn(
            'text-xs font-medium',
            selected ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          {subtitle}
        </Text>
      </View>
      {selected && <Check size={18} color={Theme.colors.foreground} />}
    </TouchableOpacity>
  );
}

export default SelectableSheetRow;
