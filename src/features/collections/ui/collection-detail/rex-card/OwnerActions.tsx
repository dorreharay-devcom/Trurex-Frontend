import React from 'react';
import { Pressable, View } from 'react-native';
import { StickyNote } from 'lucide-react-native';
import RemoveIconButton from '~/features/collections/ui/common/RemoveIconButton';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  visible: boolean;
  hasNote: boolean;
  onEditNote: () => void;
  onRemove: () => void;
};

function OwnerActions({ visible, hasNote, onEditNote, onRemove }: Props) {
  if (!visible) return null;

  const noteColor = hasNote ? Theme.colors.primary : Theme.colors.muted;

  return (
    <View className="flex-col items-center justify-center px-2 gap-2">
      <Pressable onPress={onEditNote} className="p-1">
        <StickyNote
          size={15}
          color={noteColor}
          fill={hasNote ? Theme.colors.primary : 'transparent'}
        />
      </Pressable>
      <RemoveIconButton onPress={onRemove} idleColor={Theme.colors.foreground} />
    </View>
  );
}

export default OwnerActions;
