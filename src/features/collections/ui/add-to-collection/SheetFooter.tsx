import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import NewCollectionForm from '~/features/collections/ui/add-to-collection/NewCollectionForm';
import UncollectedActions from '~/features/collections/ui/add-to-collection/UncollectedActions';
import type { SavedRexActionsState } from '~/features/collections/hooks/add-to-collection/useSavedRexActions';
import { Theme } from '~/shared/theme/Theme';
import { withWebContainer } from '~/shared/lib/ui/styles';

type Props = {
  open: boolean;
  saved: SavedRexActionsState;
  creating: boolean;
  onCreateAndAdd: (name: string) => void;
};

function SheetFooter({ open, saved, creating, onCreateAndAdd }: Props) {
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (!open) return;
    setShowNewCollection(false);
    setNewName('');
  }, [open]);

  return (
    <View className="border-t border-border">
      <View style={withWebContainer({ padding: 16 })}>
        {showNewCollection ? (
          <NewCollectionForm
            name={newName}
            creating={creating}
            onChangeName={setNewName}
            onSubmit={() => onCreateAndAdd(newName)}
          />
        ) : (
          <View className="gap-2">
            <TouchableOpacity
              onPress={() => setShowNewCollection(true)}
              activeOpacity={0.7}
              className="w-full flex-row items-center justify-center gap-1.5 py-2.5 rounded-lg border border-border"
            >
              <Plus size={14} color={Theme.colors.foreground} />
              <Text className="text-sm font-medium text-foreground">Create new collection</Text>
            </TouchableOpacity>
            <UncollectedActions saved={saved} />
          </View>
        )}
      </View>
    </View>
  );
}

export default SheetFooter;
