import { useCallback, useState } from 'react';
import { useCreateCollection } from '~/features/collections/hooks/data/useCollectionMutations';
import { useCoverImagePicker } from '~/features/collections/hooks/forms/useCoverImagePicker';
import type { CollectionVisibility } from '~/features/collections/types/collection';

export function useCreateCollectionForm(onCreated: (id: string) => void) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryTag, setCategoryTag] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState<CollectionVisibility>('private');
  const cover = useCoverImagePicker();
  const mutation = useCreateCollection();

  const creating = mutation.isPending;
  const canCreate = Boolean(name.trim()) && !creating && !cover.uploading;

  const { clear: clearCover } = cover;
  const reset = useCallback(() => {
    setName('');
    setDescription('');
    setCategoryTag(null);
    setPrivacy('private');
    clearCover();
  }, [clearCover]);

  const submit = useCallback(() => {
    if (!name.trim()) return;
    mutation.mutate(
      {
        display_name: name.trim(),
        description: description.trim() || undefined,
        cover_image_path: cover.storagePath ?? undefined,
        visibility: privacy,
      },
      {
        onSuccess: (collection) => {
          onCreated(collection.id);
          reset();
        },
      },
    );
  }, [name, description, cover.storagePath, privacy, mutation, onCreated, reset]);

  return {
    name,
    setName,
    description,
    setDescription,
    categoryTag,
    setCategoryTag,
    privacy,
    setPrivacy,
    cover,
    creating,
    canCreate,
    submit,
  };
}

export type CreateCollectionFormState = ReturnType<typeof useCreateCollectionForm>;
