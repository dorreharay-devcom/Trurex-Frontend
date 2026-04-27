import React from 'react';
import { Pressable } from 'react-native';
import { Pin } from 'lucide-react-native';
import { Theme } from '~/theme/Theme';

const PIN_STROKE = 2.25;

type DiscoverCategoryPinButtonProps = {
  isPinned: boolean;
  onPress: () => void;
};

export const DiscoverCategoryPinButton = React.memo(
  function DiscoverCategoryPinButton({ isPinned, onPress }: DiscoverCategoryPinButtonProps) {
    return (
      <Pressable
        hitSlop={8}
        accessibilityLabel={isPinned ? 'Unpin category' : 'Pin category'}
        onPress={onPress}
        className="absolute right-1 top-1 z-10 p-1"
      >
        <Pin
          size={12}
          color={isPinned ? Theme.colors.primary : Theme.colors.secondary}
          fill={isPinned ? Theme.colors.primary : 'transparent'}
          strokeWidth={PIN_STROKE}
        />
      </Pressable>
    );
  },
);

export const DiscoverCategoryPinHintIcon = React.memo(function DiscoverCategoryPinHintIcon() {
  return (
    <Pin
      size={10}
      color={Theme.colors.secondary}
      fill="transparent"
      strokeWidth={PIN_STROKE}
    />
  );
});
