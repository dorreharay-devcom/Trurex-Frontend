import { useCallback, useState } from 'react';
import { useUpdateCollectionRexNote } from '~/features/collections/hooks/data/useCollectionRexMutations';

export const REX_NOTE_MAX_LENGTH = 140;

export function useRexNoteEditor(collectionId: string) {
  const updateNote = useUpdateCollectionRexNote(collectionId);
  const [editingRexId, setEditingRexId] = useState<string | null>(null);
  const [text, setText] = useState('');

  const open = useCallback((rexId: string, existing: string | null | undefined) => {
    setEditingRexId(rexId);
    setText(existing ?? '');
  }, []);

  const close = useCallback(() => {
    setEditingRexId(null);
    setText('');
  }, []);

  const save = useCallback(
    (rexId: string) => {
      updateNote.mutate({ rex_id: rexId, note: text.trim() || null });
      close();
    },
    [updateNote, text, close],
  );

  const changeText = useCallback((value: string) => {
    setText(value.slice(0, REX_NOTE_MAX_LENGTH));
  }, []);

  return { editingRexId, text, open, close, save, changeText };
}

export type RexNoteEditorState = ReturnType<typeof useRexNoteEditor>;
