import { useState } from 'react';
import type { NetworkUserRow } from '~/features/circles/types/networkUser';

type AssignTarget = { id: string; name: string };

export type CirclesPageState = ReturnType<typeof useCirclesPageState>;

export function useCirclesPageState() {
  const [assignTarget, setAssignTarget] = useState<AssignTarget | null>(null);

  return {
    assignTarget,
    openAssign: (row: NetworkUserRow) =>
      setAssignTarget({ id: row.user_id, name: row.display_name || 'Member' }),
    closeAssign: () => setAssignTarget(null),
  };
}
