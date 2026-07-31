import { useState } from 'react';
import type { NetworkUserRow } from '~/types/network';

type AssignTarget = { id: string; name: string };

export type CirclesPageState = ReturnType<typeof useCirclesPageState>;

export function useCirclesPageState() {
  const [openCircleId, setOpenCircleId] = useState<string | null>(null);
  const [assignTarget, setAssignTarget] = useState<AssignTarget | null>(null);

  return {
    openCircleId,
    openCircle: (circleId: string) => setOpenCircleId(circleId),
    closeCircle: () => setOpenCircleId(null),
    assignTarget,
    openAssign: (row: NetworkUserRow) =>
      setAssignTarget({ id: row.user_id, name: row.display_name || 'Member' }),
    closeAssign: () => setAssignTarget(null),
  };
}
