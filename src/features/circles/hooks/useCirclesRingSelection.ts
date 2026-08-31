import { useCallback, useState } from 'react';
import type { CircleDisplayRow } from '~/shared/types/circles';

function keepKnownCircleIds(ids: Set<string>, known: ReadonlySet<string>): Set<string> {
  return new Set([...ids].filter((id) => known.has(id)));
}

export function useCirclesRingSelection() {
  const [selectedCircleIds, setSelectedCircleIds] = useState<Set<string>>(() => new Set());
  const [outerCircleId, setOuterCircleId] = useState<string | null>(null);

  const toggleCircleId = useCallback(
    (id: string) => {
      setSelectedCircleIds((prev) => {
        if (id === outerCircleId) {
          return prev.has(id) ? new Set() : new Set([id]);
        }
        const next = new Set(prev);
        if (outerCircleId) next.delete(outerCircleId);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    },
    [outerCircleId],
  );

  const ensureDefaultCircleSelectionFromApiOrder = useCallback((rows: CircleDisplayRow[]) => {
    if (!rows.length) return;
    const outerId = rows[rows.length - 1]!.id;
    const knownIds = new Set(rows.map((r) => r.id));
    setOuterCircleId(outerId);
    setSelectedCircleIds((prev) => {
      const kept = keepKnownCircleIds(prev, knownIds);
      return kept.size === 0 ? new Set([outerId]) : kept;
    });
  }, []);

  const reset = useCallback(() => {
    setSelectedCircleIds(new Set());
    setOuterCircleId(null);
  }, []);

  return {
    selectedCircleIds,
    outerCircleId,
    toggleCircleId,
    ensureDefaultCircleSelectionFromApiOrder,
    reset,
  };
}
