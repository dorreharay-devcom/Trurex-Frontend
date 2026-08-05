import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createCircle, updateCircle } from '~/features/circles/api/circlesApi';
import type { CircleDisplayRow } from '~/shared/types/circles';
import { toastError, toastSuccess } from '~/shared/lib/appToast';
import { CIRCLE_PRESET_DEFAULT, type CirclePresetColor } from '~/shared/config/circles';
import { CIRCLE_QUERY_KEYS } from '~/shared/config/queryKeys';
import { isNonEmptyString, unknownErrorMessage } from '~/shared/lib/data/guards';
import { didAccountFrozenMutationToast } from '~/shared/lib/errors/restriction';
import { assertOnlineForMutation } from '~/shared/lib/network/assertOnline';
type UseCircleEditorArgs = {
  onCreated: (circleId: string) => void;
};

export function useCircleEditor({ onCreated }: UseCircleEditorArgs) {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<CirclePresetColor>(CIRCLE_PRESET_DEFAULT);
  const [busy, setBusy] = useState(false);

  const invalidateCircles = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: CIRCLE_QUERY_KEYS.myCircles });
  }, [queryClient]);

  const resetForm = useCallback(() => {
    setName('');
    setDescription('');
    setColor(CIRCLE_PRESET_DEFAULT);
  }, []);

  const openCreateModal = useCallback(() => {
    resetForm();
    setShowCreateModal(true);
  }, [resetForm]);

  const closeCreateModal = useCallback(() => {
    setShowCreateModal(false);
    resetForm();
  }, [resetForm]);

  const submitCreate = useCallback(async () => {
    const trimmed = name.trim();
    if (!isNonEmptyString(trimmed)) return;
    if (!assertOnlineForMutation('Creating circles')) return;
    setBusy(true);
    try {
      const created = await createCircle({
        input_name: trimmed,
        input_description: description.trim() || null,
        input_icon_url: null,
        input_color: color,
      });
      toastSuccess('Circle added');
      closeCreateModal();
      invalidateCircles();
      onCreated(created.id);
    } catch (e) {
      if (didAccountFrozenMutationToast(e)) return;
      toastError('Could not create circle', unknownErrorMessage(e, 'Try again.'));
    } finally {
      setBusy(false);
    }
  }, [name, description, color, closeCreateModal, invalidateCircles, onCreated]);

  const startRename = useCallback((circle: CircleDisplayRow) => {
    setEditingId(circle.id);
    setName(circle.title);
  }, []);

  const cancelRename = useCallback(() => {
    setEditingId(null);
    setName('');
  }, []);

  const submitRename = useCallback(async () => {
    const trimmed = name.trim();
    if (!isNonEmptyString(trimmed) || editingId == null) return;
    if (!assertOnlineForMutation('Updating circles')) return;
    setBusy(true);
    try {
      await updateCircle({ input_circle_id: editingId, input_name: trimmed });
      toastSuccess('Saved', 'Circle name updated.');
      setEditingId(null);
      setName('');
      invalidateCircles();
    } catch (e) {
      if (didAccountFrozenMutationToast(e)) return;
      toastError('Rename failed', unknownErrorMessage(e, 'Try again.'));
    } finally {
      setBusy(false);
    }
  }, [editingId, name, invalidateCircles]);

  return {
    showCreateModal,
    editingId,
    name,
    setName,
    description,
    setDescription,
    color,
    setColor,
    busy,
    openCreateModal,
    closeCreateModal,
    submitCreate,
    startRename,
    cancelRename,
    submitRename,
  };
}
