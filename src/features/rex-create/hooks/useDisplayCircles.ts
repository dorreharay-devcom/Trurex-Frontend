import { useEffect, useMemo } from 'react';
import { useMyCircles } from '~/shared/hooks/useMyCircles';
import { mapApiCirclesToDisplayRows, sortCirclesForRingStack } from '~/shared/lib/circles';
import type { CircleDisplayRow } from '~/shared/types/circles';

export type DisplayCirclesState = ReturnType<typeof useDisplayCircles>;

type UseDisplayCirclesArgs = {
  visible: boolean;
  onLoaded: (circles: CircleDisplayRow[]) => void;
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
