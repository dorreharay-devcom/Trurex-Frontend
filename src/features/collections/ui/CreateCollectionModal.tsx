import React from 'react';
import { useWindowDimensions } from 'react-native';
import { useCreateCollectionForm } from '~/features/collections/hooks/forms/useCreateCollectionForm';
import CollectionModalShell from '~/features/collections/ui/common/CollectionModalShell';
import CoverImageSection from '~/features/collections/ui/common/CoverImageSection';
import CategoryTagPicker from '~/features/collections/ui/create-collection/CategoryTagPicker';
import CollectionDescriptionField from '~/features/collections/ui/create-collection/CollectionDescriptionField';
import CollectionNameField from '~/features/collections/ui/create-collection/CollectionNameField';
import CreateCollectionButton from '~/features/collections/ui/create-collection/CreateCollectionButton';
import PrivacyOptionList from '~/features/collections/ui/create-collection/PrivacyOptionList';
import { isWeb } from '~/shared/lib/ui/platform';

const CARD_MAX_HEIGHT_RATIO = 0.9;
const NATIVE_CARD_HEIGHT_RATIO = 0.82;

export type CreateCollectionModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
};

function CreateCollectionModal({ open, onClose, onCreated }: CreateCollectionModalProps) {
  const { height } = useWindowDimensions();
  const form = useCreateCollectionForm(onCreated);

  return (
    <CollectionModalShell
      open={open}
      title="New Collection"
      cardStyle={{
        maxHeight: height * CARD_MAX_HEIGHT_RATIO,
        ...(isWeb ? null : { height: height * NATIVE_CARD_HEIGHT_RATIO }),
      }}
      footer={
        <CreateCollectionButton
          canCreate={form.canCreate}
          creating={form.creating}
          onPress={form.submit}
        />
      }
      onClose={onClose}
    >
      <CoverImageSection
        coverUri={form.cover.preview}
        uploading={form.cover.uploading}
        onPick={() => void form.cover.pick()}
        onRemove={form.cover.clear}
      />
      <CollectionNameField value={form.name} onChange={form.setName} />
      <CollectionDescriptionField value={form.description} onChange={form.setDescription} />
      <CategoryTagPicker value={form.categoryTag} onChange={form.setCategoryTag} />
      <PrivacyOptionList value={form.privacy} onChange={form.setPrivacy} />
    </CollectionModalShell>
  );
}

export default CreateCollectionModal;
