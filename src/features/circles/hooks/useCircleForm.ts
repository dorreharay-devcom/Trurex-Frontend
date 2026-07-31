import { useCallback, useState } from 'react';
import type { CircleApiRow } from '~/shared/api/circlesApi';
import { CIRCLE_PRESET_DEFAULT } from '~/shared/config/circles';
import { parseCircleAccentHex } from '~/shared/lib/circles';

export type CircleFormState = ReturnType<typeof useCircleForm>;

export function useCircleForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<string>(CIRCLE_PRESET_DEFAULT);

  const reset = useCallback(() => {
    setName('');
    setDescription('');
    setColor(CIRCLE_PRESET_DEFAULT);
  }, []);

  const fillFrom = useCallback((circle: CircleApiRow) => {
    setName(circle.name);
    setDescription(circle.description ?? '');
    setColor(parseCircleAccentHex(circle) ?? CIRCLE_PRESET_DEFAULT);
  }, []);

  return {
    name,
    setName,
    description,
    setDescription,
    color,
    setColor,
    canSubmit: name.trim().length > 0,
    reset,
    fillFrom,
  };
}
