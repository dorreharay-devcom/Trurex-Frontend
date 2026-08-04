import React from 'react';
import { Pressable } from 'react-native';
import { Pin } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';

const PIN_STROKE = 2.25;

type CategoryPinButtonProps = {
  isPinned: boolean;
  onPress: () => void;
  disabled?: boolean;
};

const CategoryPinButton = React.memo(function CategoryPinButton({
  isPinned,
  onPress,
  disabled = false,
}: CategoryPinButtonProps) {
  return (
    <Pressable
      hitSlop={8}
      disabled={disabled}
      accessibilityState={{ disabled }}
      accessibilityLabel={isPinned ? 'Unpin category' : 'Pin category'}
      onPress={onPress}
      className={`absolute z-10 p-1 ${disabled ? 'opacity-40' : ''}`}
      style={{ top: 8, right: 8 }}
    >
      <Pin
        size={12}
        color={isPinned ? Theme.colors.primary : Theme.colors.secondary}
        fill={isPinned ? Theme.colors.primary : 'transparent'}
        strokeWidth={PIN_STROKE}
      />
    </Pressable>
  );
});

export default CategoryPinButton;
