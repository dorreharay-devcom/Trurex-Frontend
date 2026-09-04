import { useCallback, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { firstRouteParam, searchParam } from '~/shared/lib/navigation/routeIds';

export function useCategoryTagFilter() {
  const router = useRouter();
  const raw = useLocalSearchParams<{
    tag?: string | string[];
  }>();

  const activeTag = useMemo(() => firstRouteParam(raw.tag) ?? null, [raw.tag]);

  const toggleTag = useCallback(
    (slug: string) => {
      const next = activeTag === slug ? null : slug;
      router.setParams({ tag: searchParam(next) });
    },
    [activeTag, router],
  );

  return { activeTag, toggleTag };
}
