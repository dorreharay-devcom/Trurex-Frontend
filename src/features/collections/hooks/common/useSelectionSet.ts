import { useCallback, useState } from 'react';

export function useSelectionSet() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const replace = useCallback((ids: Iterable<string>) => {
    setSelected(new Set(ids));
  }, []);

  const reset = useCallback(() => {
    setSelected(new Set());
  }, []);

  return { selected, toggle, replace, reset };
}

export type SelectionSetState = ReturnType<typeof useSelectionSet>;
