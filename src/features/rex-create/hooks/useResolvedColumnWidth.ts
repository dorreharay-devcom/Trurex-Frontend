import { useCallback, useMemo, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import type { CategoryGridConfig } from '~/types/recommendation/categoryGrid';

export function useResolvedColumnWidth(grid: CategoryGridConfig) {
  const [rowWidth, setRowWidth] = useState<number | null>(null);

  const onGridLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setRowWidth((prev) => (Math.abs((prev ?? 0) - w) > 0.5 ? w : prev));
  }, []);

  const resolvedColumnWidth = useMemo(() => {
    if (rowWidth == null || rowWidth <= 0) return grid.tileWidth;
    return (rowWidth - grid.gap * (grid.numColumns - 1)) / grid.numColumns;
  }, [grid.gap, grid.numColumns, grid.tileWidth, rowWidth]);

  return { onGridLayout, resolvedColumnWidth };
}
