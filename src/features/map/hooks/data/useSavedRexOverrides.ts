import { useCallback, useState } from 'react';
import type { Recommendation } from '~/shared/types/recommendation';

export function useSavedRexOverrides() {
  const [savedByRecId, setSavedByRecId] = useState<Record<string, boolean>>({});

  const withSavedOverride = useCallback(
    (rec: Recommendation): Recommendation => {
      if (!(rec.id in savedByRecId)) return rec;
      return { ...rec, isSaved: savedByRecId[rec.id] };
    },
    [savedByRecId],
  );

  const markRecSaved = useCallback((recId: string) => {
    setSavedByRecId((prev) => ({ ...prev, [recId]: true }));
  }, []);

  const markRecUnsaved = useCallback((recId: string) => {
    setSavedByRecId((prev) => ({ ...prev, [recId]: false }));
  }, []);

  const clearRecSavedOverride = useCallback((recId: string) => {
    setSavedByRecId((prev) => {
      if (!(recId in prev)) return prev;
      const next = { ...prev };
      delete next[recId];
      return next;
    });
  }, []);

  return { withSavedOverride, markRecSaved, markRecUnsaved, clearRecSavedOverride };
}
