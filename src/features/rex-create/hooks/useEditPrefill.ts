import { useEffect, useLayoutEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchRexForEdit } from '~/features/rex-create/api/rexCreateApi';
import type { RexForEditRow } from '~/types/recommendation/rexDetail';
import { toastError } from '~/utils/appToast';

type UseEditPrefillArgs = {
  visible: boolean;
  editRexId: string | null;
  applyEditPrefill: (row: RexForEditRow) => void;
};

export function useEditPrefill({ visible, editRexId, applyEditPrefill }: UseEditPrefillArgs) {
  const appliedEditIdRef = useRef<string | null>(null);

  const {
    data: editRow,
    isLoading: editLoading,
    isError: editLoadError,
  } = useQuery({
    queryKey: ['rexForEdit', editRexId],
    queryFn: () => fetchRexForEdit(editRexId!),
    enabled: visible && editRexId != null,
    staleTime: 0,
  });

  useEffect(() => {
    if (!visible) appliedEditIdRef.current = null;
  }, [visible, editRexId]);

  useLayoutEffect(() => {
    if (!visible || !editRow || appliedEditIdRef.current === editRow.id) return;
    applyEditPrefill(editRow);
    appliedEditIdRef.current = editRow.id;
  }, [visible, editRow, applyEditPrefill]);

  useEffect(() => {
    if (!visible || !editLoadError) return;
    toastError('Could not load Rex', 'This Rex may no longer be editable.');
  }, [visible, editLoadError]);

  return { editLoading };
}
