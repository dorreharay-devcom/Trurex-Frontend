import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import type { CircleApiRow } from '~/shared/api/circlesApi';
import {
  circleIconKind,
  defaultCircleSubtitle,
  hexToSoftIconBackground,
  parseCircleAccentHex,
} from '~/shared/lib/circles';
import { Theme } from '~/shared/theme/Theme';
import CircleGlyphIcon from '~/features/circles/ui/common/CircleGlyphIcon';

type Props = {
  circle: CircleApiRow;
  pending: boolean;
  disabled: boolean;
  onPress: () => void;
};

const AssignableCircleRow = ({ circle, pending, disabled, onPress }: Props) => {
  const accent = parseCircleAccentHex(circle) ?? Theme.colors.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className="flex-row items-center gap-3 rounded-xl border border-border bg-background p-4 active:opacity-90"
    >
      <CircleGlyphIcon
        iconKind={circleIconKind(circle)}
        color={accent}
        bg={hexToSoftIconBackground(accent)}
        size={18}
      />
      <View className="min-w-0 flex-1">
        <Text
          className="text-sm font-semibold text-foreground"
          numberOfLines={1}
        >
          {circle.name}
        </Text>
        <Text className="text-xs text-muted-foreground" numberOfLines={2}>
          {defaultCircleSubtitle(circle)}
        </Text>
      </View>
      {pending && <ActivityIndicator size="small" color={Theme.colors.primary} />}
    </Pressable>
  );
};

export default AssignableCircleRow;
