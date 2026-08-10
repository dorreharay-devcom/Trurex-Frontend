import { useCallback, useEffect, useState } from 'react';
import { useUpdateCollection } from '~/features/collections/hooks/data/useCollectionMutations';
import { useCoverImagePicker } from '~/features/collections/hooks/forms/useCoverImagePicker';
import type {
  CollectionVisibility,
  EditableCollection,
} from '~/features/collections/types/collection';
import { toastSuccessAfterDismiss } from '~/shared/lib/appToast';
import { useSignedStorageUrl } from '~/shared/hooks/useSignedStorageUrl';
import { REX_IMAGES_BUCKET } from '~/shared/config/app';

type Params = {
  open: boolean;
  collection: EditableCollection;
  onUpdated: () => void;
};

export function useEditCollectionForm({ open, collection, onUpdated }: Params) {
  const [name, setName] = useState(collection.display_name);
  const [description, setDescription] = useState(collection.description ?? '');
  const [visibility, setVisibility] = useState<CollectionVisibility>(
    collection.visibility ?? 'private',
  );
  const [coverRemoved, setCoverRemoved] = useState(false);
  const cover = useCoverImagePicker();
  const { clear: clearCover } = cover;

  useEffect(() => {
    setName(collection.display_name);
    setDescription(collection.description ?? '');
    setVisibility(collection.visibility ?? 'private');
    setCoverRemoved(false);
    clearCover();
  }, [
    collection.id,
    open,
    collection.display_name,
    collection.description,
    collection.visibility,
    clearCover,
  ]);

  const { uri: existingCoverUri } = useSignedStorageUrl(
    REX_IMAGES_BUCKET,
    collection.cover_image_path ?? '',
  );
  const displayCoverUri = cover.preview ?? (coverRemoved ? null : existingCoverUri);

  const mutation = useUpdateCollection();
  const saving = mutation.isPending;
  const canSave = Boolean(name.trim()) && !saving && !cover.uploading;

  const pickCover = useCallback(() => {
    setCoverRemoved(false);
    void cover.pick();
  }, [cover]);

  const removeCover = useCallback(() => {
    clearCover();
    setCoverRemoved(true);
  }, [clearCover]);

  const submit = useCallback(() => {
    if (!name.trim()) return;
    const coverChanged = cover.storagePath !== null || coverRemoved;
    mutation.mutate(
      {
        collection_id: collection.id,
        display_name: name.trim(),
        description: description.trim() || null,
        update_cover_image_path: coverChanged,
        cover_image_path: coverChanged ? (cover.storagePath ?? null) : undefined,
        visibility,
      },
      { onSuccess: () => toastSuccessAfterDismiss(onUpdated, 'Collection updated!') },
    );
  }, [
    name,
    description,
    visibility,
    cover.storagePath,
    coverRemoved,
    mutation,
    collection.id,
    onUpdated,
  ]);

  return {
    name,
    setName,
    description,
    setDescription,
    visibility,
    setVisibility,
    uploading: cover.uploading,
    displayCoverUri,
    pickCover,
    removeCover,
    saving,
    canSave,
    submit,
  };
}
