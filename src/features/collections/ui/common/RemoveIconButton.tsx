import React from 'react';
import { Pressable, View } from 'react-native';
import { X } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { cn } from '~/utils/general';

type PressableInteraction = { hovered?: boolean; pressed?: boolean };

type Props = {
  onPress: () => void;
  idleColor?: string;
};

function RemoveIconButton({ onPress, idleColor = Theme.colors.muted }: Props) {
  return (
    <Pressable onPress={onPress} className="p-0.5">
      {({ hovered, pressed }: PressableInteraction) => {
        const active = hovered || pressed;
        return (
          <View
            className={cn(
              'w-6 h-6 rounded-full items-center justify-center',
              active && 'bg-destructive/10',
            )}
          >
            <X size={12} color={active ? Theme.colors.destructive : idleColor} />
          </View>
        );
      }}
    </Pressable>
  );
}

export default RemoveIconButton;
