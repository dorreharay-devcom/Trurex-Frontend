import React from 'react';
import { Text, TouchableOpacity, View, type TextStyle } from 'react-native';
import { isWeb } from '~/shared/lib/ui/platform';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  onCreatePress?: () => void;
};

const GRADIENT_TEXT_STYLE = isWeb
  ? ({
      backgroundImage: `linear-gradient(90deg, ${Theme.colors.accentForeground}, ${Theme.colors.ratingStar})`,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
    } as unknown as TextStyle)
  : { color: Theme.colors.ratingStar };

const RexRequestEmptyState = ({ onCreatePress }: Props) => (
  <View className="items-center py-16 px-4 gap-4">
    <View className="items-center">
      <Text className="font-display text-xl font-bold text-foreground text-center">
        Ask the people who
      </Text>
      <Text className="font-display text-xl font-bold text-center" style={GRADIENT_TEXT_STYLE}>
        actually know
      </Text>
    </View>
    <Text className="text-sm text-muted-foreground text-center">
      Send a Rex Request to your trusted circles and get recommendations that matter.
    </Text>
    <TouchableOpacity
      onPress={onCreatePress}
      activeOpacity={0.85}
      className="items-center rounded-xl bg-primary px-6 py-3.5"
      accessibilityRole="button"
      accessibilityLabel="Create Rex Request"
    >
      <Text className="text-sm font-semibold text-primary-foreground">Create Rex Request</Text>
    </TouchableOpacity>
  </View>
);

export default RexRequestEmptyState;
