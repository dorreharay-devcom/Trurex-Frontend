import React from 'react';
import { Pressable, Text } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  onPress: () => void;
};

const LegalBackButton = ({ onPress }: Props) => (
  <Pressable
    onPress={onPress}
    hitSlop={12}
    accessibilityRole="button"
    accessibilityLabel="Go back"
    className="z-10 flex-row items-center gap-1 self-start py-1"
  >
    <ChevronLeft size={20} color={Theme.colors.foreground} pointerEvents="none" />
    <Text pointerEvents="none" className="text-sm font-medium text-foreground">
      Back
    </Text>
  </Pressable>
);

export default LegalBackButton;
