import React from 'react';
import { useWindowDimensions } from 'react-native';
import BottomSheet from '~/features/collections/ui/common/BottomSheet';
import SheetHeader from '~/features/collections/ui/common/SheetHeader';
import CollectionPickerList from '~/features/collections/ui/add-to-collection/CollectionPickerList';
import SheetFooter from '~/features/collections/ui/add-to-collection/SheetFooter';
import { useAddToCollectionActions } from '~/features/collections/hooks/add-to-collection/useAddToCollectionActions';
import { useCollectionPicker } from '~/features/collections/hooks/add-to-collection/useCollectionPicker';
import { useSavedRexActions } from '~/features/collections/hooks/add-to-collection/useSavedRexActions';
import type { RecSummary } from '~/features/collections/types/recSummary';

const SHEET_MAX_HEIGHT_RATIO = 0.75;
const SHEET_CHROME_HEIGHT = 220;
const LIST_MIN_HEIGHT = 160;

export type AddToCollectionSheetProps = {
  open: boolean;
  rec: RecSummary | null;
  onClose: () => void;
  onRemove?: () => void;
  onUnsaved?: () => void;
  onUnsaveFailed?: () => void;
  onSaveRexFailed?: () => void;
  onSaved?: () => void;
  onCollectionCreated?: (collectionName: string) => void;
};

function AddToCollectionSheet({
  open,
  rec,
  onClose,
  onRemove,
  onUnsaved,
  onUnsaveFailed,
  onSaveRexFailed,
  onSaved,
  onCollectionCreated,
}: AddToCollectionSheetProps) {
  const { height } = useWindowDimensions();
  const sheetMaxHeight = height * SHEET_MAX_HEIGHT_RATIO;
  const listMaxHeight = Math.max(sheetMaxHeight - SHEET_CHROME_HEIGHT, LIST_MIN_HEIGHT);

  const picker = useCollectionPicker(open, rec);
  const saved = useSavedRexActions({
    open,
    rec,
    onSaved,
    onRemove,
    onUnsaved,
    onUnsaveFailed,
    onSaveRexFailed,
  });
  const actions = useAddToCollectionActions({
    rec,
    selected: picker.selected,
    original: picker.original,
    ensureRexSaved: saved.ensureRexSaved,
    setError: picker.setError,
    onClose,
    onCollectionCreated,
  });

  return (
    <BottomSheet
      open={open && rec != null}
      onClose={onClose}
      sheetStyle={{ maxHeight: sheetMaxHeight }}
    >
      <SheetHeader
        title="Add to collection"
        actionLabel="Done"
        busy={actions.saving}
        onAction={() => void actions.applyChanges()}
      />
      <CollectionPickerList picker={picker} maxHeight={listMaxHeight} />
      <SheetFooter
        open={open}
        saved={saved}
        creating={actions.creating}
        onCreateAndAdd={(name) => void actions.createAndAdd(name)}
      />
    </BottomSheet>
  );
}

export default AddToCollectionSheet;
