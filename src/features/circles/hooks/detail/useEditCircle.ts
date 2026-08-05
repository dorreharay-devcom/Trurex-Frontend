import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { updateCircle } from '~/features/circles/api/circlesApi';
import { CIRCLES_QUERY_KEYS } from '~/features/circles/config/queryKeys';
import { useCircleForm } from '~/features/circles/hooks/useCircleForm';
import type { CircleApiRow } from '~/features/circles/types/circle';
import { mutationErrorToast } from '~/shared/lib/errors/restriction';
import { withOnlineMutation } from '~/shared/lib/network/assertOnline';
import { toastSuccess } from '~/shared/lib/appToast';

export type EditCircleState = ReturnType<typeof useEditCircle>;

export function useEditCircle(circle: CircleApiRow | undefined) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const form = useCircleForm();

  const mutationFn = withOnlineMutation('Updating circles', (_: void) => {
    if (!circle) throw new Error('No circle');
    return updateCircle({
      input_circle_id: circle.id,
      input_name: form.name.trim(),
      input_description: form.description.trim(),
      input_color: form.color,
    });
  });
  const updateMutation = useMutation({
    mutationFn,
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
    updateMutation.mutate(undefined);
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
