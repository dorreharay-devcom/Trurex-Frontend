import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import RemoveIconButton from '~/features/collections/ui/common/RemoveIconButton';
import SavedDate from '~/features/gems/ui/uncollected-rex-row/SavedDate';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  savedAt: string | null | undefined;
  onAdd: () => void;
  onRemove: () => void;
};

function RexRowActions({ savedAt, onAdd, onRemove }: Props) {
  return (
    <View className="flex-col items-end gap-1.5 flex-shrink-0">
      <SavedDate savedAt={savedAt} />
      <View className="flex-row items-center gap-2">
        <TouchableOpacity
          onPress={onAdd}
          activeOpacity={0.7}
          className="flex-row items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border"
        >
          <Plus size={10} color={Theme.colors.foreground} />
          <Text className="text-[11px] font-medium text-foreground">Add</Text>
        </TouchableOpacity>
        <RemoveIconButton onPress={onRemove} />
      </View>
    </View>
  );
}

export default RexRowActions;
