import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCircle } from '~/features/circles/api/circlesApi';
import { CIRCLES_QUERY_KEYS } from '~/features/circles/config/queryKeys';
import type { CircleApiRow } from '~/features/circles/types/circle';
import { mutationErrorToast } from '~/shared/lib/errors/restriction';
import { toastSuccess } from '~/shared/lib/appToast';

type CircleFormInput = {
  name: string;
  description: string;
  color: string;
};

type Args = {
  onCreated?: (circle: CircleApiRow) => void;
};

export function useCreateCircle({ onCreated }: Args = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CircleFormInput) =>
      createCircle({
        input_name: input.name.trim(),
        input_description: input.description.trim() || null,
        input_icon_url: null,
        input_color: input.color,
      }),
    onSuccess: (circle) => {
      void queryClient.invalidateQueries({ queryKey: CIRCLES_QUERY_KEYS.myCircles });
      toastSuccess('Circle created');
      onCreated?.(circle);
    },
    onError: mutationErrorToast('Could not create circle'),
  });
}
