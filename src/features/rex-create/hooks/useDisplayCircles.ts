import { useEffect, useMemo } from 'react';
import { useMyCircles } from '~/hooks/useMyCircles';
import {
  mapApiCirclesToDisplayRows,
  sortCirclesForRingStack,
} from '~/utils/recommendation/recCircles';
import type { CreateRecCircle } from '~/constants/recommendation/createCircles';

export type DisplayCirclesState = ReturnType<typeof useDisplayCircles>;

type UseDisplayCirclesArgs = {
  visible: boolean;
  onLoaded: (circles: CreateRecCircle[]) => void;
};

export function useDisplayCircles({ visible, onLoaded }: UseDisplayCirclesArgs) {
  const { data: apiCircles, isLoading, isError, refetch } = useMyCircles(visible);

  const displayCircles = useMemo(() => {
    const sorted = apiCircles?.length ? sortCirclesForRingStack(apiCircles) : [];
    return sorted.length ? mapApiCirclesToDisplayRows(sorted) : [];
  }, [apiCircles]);

  useEffect(() => {
    if (!visible || displayCircles.length === 0) return;
    onLoaded(displayCircles);
  }, [visible, displayCircles, onLoaded]);

  const circleTitleLookup = useMemo(
    () => displayCircles.map((c) => ({ id: c.id, title: c.title })),
    [displayCircles],
  );

  const showFetchSpinner = Boolean(visible && isLoading && apiCircles === undefined && !isError);

  return { displayCircles, circleTitleLookup, showFetchSpinner, loadError: isError, refetch };
}
