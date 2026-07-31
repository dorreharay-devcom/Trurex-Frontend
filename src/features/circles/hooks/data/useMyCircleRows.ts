import { useMemo } from 'react';
import { mapApiCirclesToDisplayRows, sortCirclesForRingStack } from '~/shared/lib/circles';
import { useMyCircles } from '~/shared/hooks/useMyCircles';

export function useMyCircleRows(enabled: boolean) {
  const { data = [], isLoading, isError } = useMyCircles(enabled);

  const circles = useMemo(() => sortCirclesForRingStack(data), [data]);
  const displayRows = useMemo(() => mapApiCirclesToDisplayRows(circles), [circles]);

  return { circles, displayRows, isLoading, isError };
}
