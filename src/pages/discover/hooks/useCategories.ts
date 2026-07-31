import { useCallback, useMemo } from 'react';
import { useActiveCategories } from '~/hooks/useActiveCategories';
import { usePinnedCategoryIds } from '~/pages/discover/hooks/usePinnedCategoryIds';
import { categoryPillColor } from '~/utils/recommendation/recCategoryNav';
import { CATEGORY_ICON_FALLBACK } from '~/utils/recommendation/categoryIconResolve';
import type { Category } from '~/pages/discover/types';

export function useCategories() {
  const { pinnedCategoryIds, togglePin, isTogglingPin } = usePinnedCategoryIds();
  const { data: activeCategoryRows, isPending: categoriesPending } = useActiveCategories(true);

  const allCats = useMemo((): Category[] => {
    if (!activeCategoryRows?.length) return [];
    return activeCategoryRows.map((row) => ({
      id: row.id,
      code: row.code,
      serverId: row.id,
      label: row.display_name,
      emoji: row.icon?.trim() || CATEGORY_ICON_FALLBACK,
      color: categoryPillColor(row.code),
    }));
  }, [activeCategoryRows]);

  const isPinned = useCallback(
    (c: Category) => Boolean(c.serverId && pinnedCategoryIds.includes(c.serverId)),
    [pinnedCategoryIds],
  );

  const pinnedCats = useMemo(() => allCats.filter(isPinned), [allCats, isPinned]);
  const remainingCats = useMemo(() => allCats.filter((c) => !isPinned(c)), [allCats, isPinned]);

  return {
    allCats,
    pinnedCats,
    remainingCats,
    isPinned,
    togglePin,
    isTogglingPin,
    categoriesPending,
  };
}
