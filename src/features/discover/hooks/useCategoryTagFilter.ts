import { useCallback, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ALL_CATEGORIES } from '~/features/discover/types';
import { firstRouteParam, searchParam } from '~/shared/lib/navigation/routeIds';

export function useCategoryTagFilter() {
  const router = useRouter();
  const raw = useLocalSearchParams<{
    category?: string | string[];
    tag?: string | string[];
  }>();

  const activeCategory = useMemo(() => {
    const category = firstRouteParam(raw.category);
    return category ?? ALL_CATEGORIES;
  }, [raw.category]);

  const activeTag = useMemo(() => firstRouteParam(raw.tag) ?? null, [raw.tag]);

  const toggleCategory = useCallback(
    (code: string) => {
      const next = activeCategory === code ? ALL_CATEGORIES : code;
      router.setParams({ category: next });
    },
    [activeCategory, router],
  );

  const toggleTag = useCallback(
    (slug: string) => {
      const next = activeTag === slug ? null : slug;
      router.setParams({ tag: searchParam(next) });
    },
    [activeTag, router],
  );

  return { activeCategory, activeTag, toggleCategory, toggleTag };
}
