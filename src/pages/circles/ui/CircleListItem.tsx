import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import type { CircleDisplayRow } from '~/shared/types/circles';
import CircleGlyphIcon from '~/features/circles/ui/common/CircleGlyphIcon';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  row: CircleDisplayRow;
  onPress: () => void;
};

const CircleListItem = ({ row, onPress }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm active:opacity-95"
    >
      <CircleGlyphIcon iconKind={row.iconKind} color={row.accent} bg={row.iconBg} size={20} />
      <View className="min-w-0 flex-1">
        <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
          {row.title}
        </Text>
        <Text className="text-xs text-muted-foreground" numberOfLines={1}>
          {row.subtitle}
        </Text>
      </View>
      <ChevronRight size={16} color={Theme.colors.muted} />
    </Pressable>
  );
};

export default CircleListItem;
