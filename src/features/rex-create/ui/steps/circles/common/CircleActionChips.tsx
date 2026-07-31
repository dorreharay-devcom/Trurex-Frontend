import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Pencil, Plus } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  showAdd: boolean;
  addDisabled: boolean;
  onAdd: () => void;
  showRename: boolean;
  onRename: () => void;
};

function CircleActionChips({ showAdd, addDisabled, onAdd, showRename, onRename }: Props) {
  return (
    <View className="flex-row flex-wrap items-center justify-center gap-2">
      {showAdd ? (
        <Pressable
          onPress={onAdd}
          disabled={addDisabled}
          accessibilityRole="button"
          className="flex-row items-center gap-1.5 rounded-full border border-border px-3 py-1.5 active:bg-muted/40 disabled:opacity-50"
        >
          <Plus size={14} color={Theme.colors.foreground} />
          <Text className="text-xs font-medium text-foreground">Add circle</Text>
        </Pressable>
      ) : null}
      {showRename ? (
        <Pressable
          onPress={onRename}
          accessibilityRole="button"
          className="flex-row items-center gap-1.5 rounded-full border border-border px-3 py-1.5 active:bg-muted/40"
        >
          <Pencil size={14} color={Theme.colors.secondaryText} />
          <Text className="text-xs font-medium text-muted-foreground">Rename</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export default CircleActionChips;
