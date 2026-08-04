import React from 'react';
import { useWindowDimensions } from 'react-native';
import { useEditCollectionForm } from '~/features/collections/hooks/forms/useEditCollectionForm';
import CollectionModalShell from '~/features/collections/ui/common/CollectionModalShell';
import CoverImageSection from '~/features/collections/ui/common/CoverImageSection';
import EditDescriptionField from '~/features/collections/ui/edit-collection/EditDescriptionField';
import EditNameField from '~/features/collections/ui/edit-collection/EditNameField';
import SaveChangesButton from '~/features/collections/ui/edit-collection/SaveChangesButton';
import VisibilityToggleRow from '~/features/collections/ui/edit-collection/VisibilityToggleRow';
import type { EditableCollection } from '~/features/collections/types/collection';

const CARD_MAX_HEIGHT = 680;
const CARD_MAX_HEIGHT_RATIO = 0.9;

export type EditCollectionModalProps = {
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
  collection: EditableCollection;
};

function EditCollectionModal({ open, onClose, onUpdated, collection }: EditCollectionModalProps) {
  const { height } = useWindowDimensions();
  const form = useEditCollectionForm({ open, collection, onUpdated });
  const maxHeight = height * CARD_MAX_HEIGHT_RATIO;

  return (
    <CollectionModalShell
      open={open}
      title="Edit Collection"
      cardStyle={{ height: Math.min(maxHeight, CARD_MAX_HEIGHT), maxHeight }}
      footer={
        <SaveChangesButton canSave={form.canSave} saving={form.saving} onPress={form.submit} />
      }
      onClose={onClose}
    >
      <CoverImageSection
        coverUri={form.displayCoverUri}
        uploading={form.uploading}
        contentFit="contain"
        onPick={form.pickCover}
        onRemove={form.removeCover}
      />
      <EditNameField value={form.name} onChange={form.setName} />
      <VisibilityToggleRow value={form.visibility} onChange={form.setVisibility} />
      <EditDescriptionField value={form.description} onChange={form.setDescription} />
    </CollectionModalShell>
  );
}

export default EditCollectionModal;
