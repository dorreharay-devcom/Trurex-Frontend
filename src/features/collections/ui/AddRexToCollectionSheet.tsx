import React from 'react';
import { ScrollView, useWindowDimensions } from 'react-native';
import BottomSheet from '~/shared/ui/BottomSheet';
import SheetHeader from '~/features/collections/ui/common/SheetHeader';
import SavedRexList from '~/features/collections/ui/SavedRexList';
import { useAddRexesToCollection } from '~/features/collections/hooks/useAddRexesToCollection';
import { withWebContainer } from '~/shared/lib/ui/styles';

const SHEET_MAX_HEIGHT = 500;
const SHEET_HEIGHT_RATIO = 0.55;

type Props = {
  open: boolean;
  collectionId: string | null;
  onClose: () => void;
};

function AddRexToCollectionSheet({ open, collectionId, onClose }: Props) {
  const { height } = useWindowDimensions();
  const { list, selection, saving, submit } = useAddRexesToCollection({
    open,
    collectionId,
    onClose,
  });
  const selectedCount = selection.selected.size;

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      sheetStyle={{
        height: Math.min(SHEET_MAX_HEIGHT, height * SHEET_HEIGHT_RATIO),
        maxHeight: SHEET_MAX_HEIGHT,
      }}
    >
      <SheetHeader
        title="Pick a saved rex"
        actionLabel={selectedCount > 0 ? `Add ${selectedCount}` : 'Done'}
        busy={saving}
        onAction={() => void submit()}
        className="pb-3"
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={withWebContainer({ padding: 12, gap: 2 })}
        style={{ flex: 1 }}
      >
        <SavedRexList list={list} selected={selection.selected} onToggle={selection.toggle} />
      </ScrollView>
    </BottomSheet>
  );
}

export default AddRexToCollectionSheet;
