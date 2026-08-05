import React from 'react';
import { Pressable, View } from 'react-native';
import { RexCoverThumbnail } from '~/shared/ui/media/RexCoverThumbnail';
import OwnerActions from '~/features/collections/ui/collection-detail/rex-card/OwnerActions';
import RexCardDetails from '~/features/collections/ui/collection-detail/rex-card/RexCardDetails';
import SavedNote from '~/features/collections/ui/collection-detail/rex-card/SavedNote';
import RexNoteEditor from '~/features/collections/ui/collection-detail/RexNoteEditor';
import { entryToRecommendation } from '~/features/collections/lib/mappers';
import type { CollectionRexEntry } from '~/features/collections/types/collection';
import type { RexNoteEditorState } from '~/features/collections/hooks/collection-detail/useRexNoteEditor';

type Props = {
  item: CollectionRexEntry;
  isMyCollection: boolean;
  noteEditor: RexNoteEditorState;
  onPress: () => void;
  onRemove: () => void;
};

function CollectionRexCard({ item, isMyCollection, noteEditor, onPress, onRemove }: Props) {
  const isEditingNote = noteEditor.editingRexId === item.rex_id;

  return (
    <View className="px-4 mb-3">
      <View className="bg-card border border-border rounded-xl overflow-hidden">
        <View className="flex-row">
          <Pressable onPress={onPress} className="flex-1 flex-row gap-3 p-3">
            <RexCoverThumbnail
              rec={entryToRecommendation(item)}
              className="h-16 w-16 rounded-lg flex-shrink-0"
            />
            <RexCardDetails item={item} />
          </Pressable>
          <OwnerActions
            visible={isMyCollection}
            hasNote={!!item.note}
            onEditNote={() => noteEditor.open(item.rex_id, item.note)}
            onRemove={onRemove}
          />
        </View>

        <SavedNote note={item.note} hidden={isEditingNote} />
        {isEditingNote && <RexNoteEditor rexId={item.rex_id} editor={noteEditor} />}
      </View>
    </View>
  );
}

export default CollectionRexCard;
