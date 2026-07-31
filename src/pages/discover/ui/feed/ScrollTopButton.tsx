import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ChevronUp } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';

type ScrollTopButtonProps = {
  onPress: () => void;
};

const ScrollTopButton = ({ onPress }: ScrollTopButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel="Scroll to top"
      className="absolute bottom-[102px] h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-primary/55"
      style={{ right: 24 }}
    >
      <ChevronUp size={26} color={Theme.colors.foreground} />
    </TouchableOpacity>
  );
};

export default ScrollTopButton;
