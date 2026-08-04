import { useCallback, useState } from 'react';
import { keepKnownCircleIds, PUBLIC_CIRCLE_KEY } from '~/features/rex-create/lib/sharing';
import { REX_VISIBILITY } from '~/features/rex-create/lib/sharing';
import type { CircleDisplayRow } from '~/shared/types/circles';
import type { RexForEditRow } from '~/features/rex-detail/types/rexDetail';

export function useShareCircles() {
  const [selectedCircleIds, setSelectedCircleIds] = useState<Set<string>>(() => new Set());
  const [publicCircleId, setPublicCircleId] = useState<string | null>(null);
  const [privateRex, setPrivateRexState] = useState(false);

  const toggleCircleId = useCallback(
    (id: string) => {
      setSelectedCircleIds((prev) => {
        if (id === PUBLIC_CIRCLE_KEY || id === publicCircleId) {
          return prev.has(id) ? new Set() : new Set([id]);
        }
        const next = new Set(prev);
        next.delete(PUBLIC_CIRCLE_KEY);
        if (publicCircleId) next.delete(publicCircleId);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    },
    [publicCircleId],
  );

  const setPrivateRex = useCallback((selected: boolean) => {
    setPrivateRexState(selected);
    if (selected) setSelectedCircleIds(new Set());
  }, []);

  const ensureDefaultCircleSelectionFromApiOrder = useCallback((rows: CircleDisplayRow[]) => {
    if (!rows.length) return;
    const outerId = rows[rows.length - 1]!.id;
    const knownIds = new Set(rows.map((r) => r.id));
    setPublicCircleId(outerId);
    setSelectedCircleIds((prev) => {
      const kept = keepKnownCircleIds(prev, knownIds);
      if (kept.has(PUBLIC_CIRCLE_KEY)) {
        const next = new Set(kept);
        next.delete(PUBLIC_CIRCLE_KEY);
        next.add(outerId);
        return next;
      }
      if (kept.size === 0) return new Set([outerId]);
      return kept;
    });
  }, []);

  const prefillFromEditRow = useCallback((row: RexForEditRow) => {
    setSelectedCircleIds(new Set(row.visibility === REX_VISIBILITY.circles ? row.circle_ids : []));
    setPrivateRexState(row.visibility === REX_VISIBILITY.private);
  }, []);

  const reset = useCallback(() => {
    setSelectedCircleIds(new Set());
    setPublicCircleId(null);
    setPrivateRexState(false);
  }, []);

  return {
    selectedCircleIds,
    publicCircleId,
    privateRex,
    setPrivateRex,
    toggleCircleId,
    ensureDefaultCircleSelectionFromApiOrder,
    prefillFromEditRow,
    reset,
  };
}
