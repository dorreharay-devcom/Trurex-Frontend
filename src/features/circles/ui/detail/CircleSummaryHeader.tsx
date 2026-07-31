import React from 'react';
import { Text, View } from 'react-native';
import type { CircleApiRow } from '~/shared/api/circlesApi';
import type { CircleDisplayRow } from '~/shared/types/circles';
import { memberCountLabel } from '~/features/circles/lib/labels';
import CircleGlyphIcon from '~/features/circles/ui/common/CircleGlyphIcon';

type Props = {
  circle: CircleApiRow;
  displayRow: CircleDisplayRow;
  memberCount: number;
};

const CircleSummaryHeader = ({ circle, displayRow, memberCount }: Props) => {
  const subtitle = circle.description?.trim() || displayRow.subtitle;

  return (
    <View className="mb-6 flex-row items-start gap-3">
      <CircleGlyphIcon
        iconKind={displayRow.iconKind}
        color={displayRow.accent}
        bg={displayRow.iconBg}
        size={22}
        large
      />
      <View className="min-w-0 flex-1">
        <Text className="text-lg font-semibold text-foreground">{circle.name}</Text>
        {subtitle && <Text className="mt-0.5 text-xs text-muted-foreground">{subtitle}</Text>}
      </View>
      <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: displayRow.iconBg }}>
        <Text className="text-xs font-semibold" style={{ color: displayRow.accent }}>
          {memberCountLabel(memberCount)}
        </Text>
      </View>
    </View>
  );
};

export default CircleSummaryHeader;
