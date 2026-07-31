import React from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft, MoreVertical } from 'lucide-react-native';
import CollectionMenu from '~/features/collections/ui/collection-detail/CollectionMenu';
import type { CollectionActionsState } from '~/features/collections/hooks/collection-detail/useCollectionActions';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  isMyCollection: boolean;
  actions: CollectionActionsState;
  onBack: () => void;
};

function CollectionHeaderBar({ isMyCollection, actions, onBack }: Props) {
  return (
    <>
      <View className="relative z-20 w-full flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity onPress={onBack} className="flex-row items-center gap-1">
          <ArrowLeft size={16} color={Theme.colors.muted} />
          <Text className="text-sm text-muted-foreground">Back</Text>
        </TouchableOpacity>
        <View className="relative">
          <TouchableOpacity onPress={() => actions.setShowMenu(!actions.showMenu)} className="p-2">
            <MoreVertical size={18} color={Theme.colors.muted} />
          </TouchableOpacity>
          <CollectionMenu isMyCollection={isMyCollection} actions={actions} />
        </View>
      </View>

      {actions.showMenu ? (
        <Pressable
          onPress={() => actions.setShowMenu(false)}
          style={[StyleSheet.absoluteFill, { zIndex: 10 }]}
        />
      ) : null}
    </>
  );
}

export default CollectionHeaderBar;
