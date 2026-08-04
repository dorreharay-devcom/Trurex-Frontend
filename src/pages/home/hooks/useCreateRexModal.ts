import { useCallback, useState } from 'react';
import type { AddYourOwnRecSource } from '~/features/rex-create';

export function useCreateRexModal() {
  const [visible, setVisible] = useState(false);
  const [addYourOwnPrefill, setAddYourOwnPrefill] = useState<AddYourOwnRecSource | null>(null);
  const [editRexId, setEditRexId] = useState<string | null>(null);

  const openBlank = useCallback(() => {
    setAddYourOwnPrefill(null);
    setEditRexId(null);
    setVisible(true);
  }, []);

  const openWithPrefill = useCallback((source: AddYourOwnRecSource) => {
    setAddYourOwnPrefill(source);
    setEditRexId(null);
    setVisible(true);
  }, []);

  const openForEdit = useCallback((rexId: string) => {
    setEditRexId(rexId);
    setAddYourOwnPrefill(null);
    setVisible(true);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    setAddYourOwnPrefill(null);
    setEditRexId(null);
  }, []);

  return { visible, addYourOwnPrefill, editRexId, openBlank, openWithPrefill, openForEdit, close };
}

export type CreateRexModalState = ReturnType<typeof useCreateRexModal>;
