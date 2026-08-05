import { useMemo } from 'react';
import {
  mapApiCirclesToDisplayRows,
  sortCirclesForRingStack,
} from '~/features/circles/lib/display';
import { useMyCircles } from '~/features/circles/hooks/data/useMyCircles';

export function useMyCircleRows(enabled: boolean) {
  const query = useMyCircles(enabled);

  const circles = useMemo(() => sortCirclesForRingStack(query.data ?? []), [query.data]);
  const displayRows = useMemo(() => mapApiCirclesToDisplayRows(circles), [circles]);

  return {
    circles,
    displayRows,
    isLoading: query.isLoading,
    isError: query.isError && circles.length === 0,
    retry: () => void query.refetch(),
  };
}
