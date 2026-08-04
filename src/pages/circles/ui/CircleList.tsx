import React from 'react';
import { Text, View } from 'react-native';
import { Users } from 'lucide-react-native';
import type { CircleDisplayRow } from '~/shared/types/circles';
import CircleListItem from '~/pages/circles/ui/CircleListItem';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  rows: CircleDisplayRow[];
  onOpenCircle: (circleId: string) => void;
};

const CircleList = ({ rows, onOpenCircle }: Props) => {
  if (rows.length === 0) {
    return (
      <View className="items-center py-12">
        <Users size={48} color={Theme.colors.muted} style={{ opacity: 0.45 }} />
        <Text className="mt-3 text-sm font-medium text-muted-foreground">No circles yet</Text>
        <Text className="mt-1 max-w-xs text-center text-xs text-muted-foreground">
          Create a circle and add people from Followers or Trusted.
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-3">
      {rows.map((row) => (
        <CircleListItem key={row.id} row={row} onPress={() => onOpenCircle(row.id)} />
      ))}
    </View>
  );
};

export default CircleList;
