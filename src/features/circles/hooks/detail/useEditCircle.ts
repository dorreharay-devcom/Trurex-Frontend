import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { updateCircle, type CircleApiRow } from '~/shared/api/circlesApi';
import { CIRCLES_QUERY_KEYS } from '~/features/circles/config/queryKeys';
import { useCircleForm } from '~/features/circles/hooks/useCircleForm';
import { mutationErrorToast } from '~/shared/lib/mutationErrorToast';
import { toastSuccess } from '~/utils/appToast';

export type EditCircleState = ReturnType<typeof useEditCircle>;

export function useEditCircle(circle: CircleApiRow | undefined) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const form = useCircleForm();

  const updateMutation = useMutation({
    mutationFn: () => {
      if (!circle) throw new Error('No circle');
      return updateCircle({
        input_circle_id: circle.id,
        input_name: form.name.trim(),
        input_description: form.description.trim(),
        input_color: form.color,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CIRCLES_QUERY_KEYS.myCircles });
      setOpen(false);
      toastSuccess('Circle updated');
    },
    onError: mutationErrorToast('Could not update circle'),
  });

  const openForCircle = () => {
    if (!circle) return;
    form.fillFrom(circle);
    setOpen(true);
  };

  const save = () => {
    if (!form.canSubmit || updateMutation.isPending) return;
    updateMutation.mutate();
  };

  return {
    open,
    close: () => setOpen(false),
    openForCircle,
    form,
    save,
    saving: updateMutation.isPending,
  };
}
