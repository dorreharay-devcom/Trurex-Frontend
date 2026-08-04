import { useEffect } from 'react';
import { useMyCircleRows } from '~/features/circles/hooks/data/useMyCircleRows';

export function useCircleDetail(circleId: string, enabled: boolean, onGone: () => void) {
  const { circles, displayRows, isLoading } = useMyCircleRows(enabled);

  const circle = circles.find((c) => c.id === circleId);
  const displayRow = displayRows.find((row) => row.id === circleId);

  useEffect(() => {
    if (!isLoading && circles.length > 0 && !circle) onGone();
  }, [isLoading, circles, circle, onGone]);

  return { circle, displayRow };
}
