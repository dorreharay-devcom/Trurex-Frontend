import type { InfiniteData, QueryClient } from '@tanstack/react-query';
import type { MapPinRow } from '~/features/map/types/mapPinRow';
import { REX_QUERY_KEYS } from '~/shared/config/queryKeys';
import type { Recommendation } from '~/shared/types/recommendation';

export const AFTER_CREATE_FEED_KEYS = [
  REX_QUERY_KEYS.discoverFeed,
  REX_QUERY_KEYS.myRexes,
  REX_QUERY_KEYS.searchRexes,
] as const;

export const AFTER_CREATE_MAP_KEYS = [
  REX_QUERY_KEYS.mapRexPins,
  REX_QUERY_KEYS.mapRexesInBounds,
] as const;

export const CREATE_MUST_NOT_INVALIDATE = [REX_QUERY_KEYS.mySavedRexes] as const;

export function invalidateAfterRexWrite(
  queryClient: QueryClient,
  options?: {
    editRexId?: string | null;
  },
) {
  for (const queryKey of AFTER_CREATE_MAP_KEYS) {
    void queryClient.invalidateQueries({ queryKey, refetchType: 'all' });
  }

  for (const queryKey of AFTER_CREATE_FEED_KEYS) {
    void queryClient.invalidateQueries({ queryKey, refetchType: 'active' });
  }

  if (options?.editRexId) {
    void queryClient.invalidateQueries({ queryKey: ['rexDetail', options.editRexId] });
    void queryClient.invalidateQueries({ queryKey: ['rexForEdit', options.editRexId] });
    void queryClient.invalidateQueries({
      queryKey: ['collection-detail'],
      refetchType: 'active',
    });
  }
}

export function prependRecommendationPage(
  data: InfiniteData<Recommendation[]> | undefined,
  rec: Recommendation,
): InfiniteData<Recommendation[]> | undefined {
  if (!data?.pages?.length) {
    return { pages: [[rec]], pageParams: data?.pageParams ?? [0] };
  }
  const first = data.pages[0] ?? [];
  if (first.some((r) => r.id === rec.id)) return data;
  return {
    ...data,
    pages: [[rec, ...first], ...data.pages.slice(1)],
  };
}

export function prependRecommendationToFeedCaches(
  queryClient: QueryClient,
  rec: Recommendation,
): void {
  for (const queryKey of [REX_QUERY_KEYS.discoverFeed, REX_QUERY_KEYS.myRexes] as const) {
    queryClient.setQueriesData<InfiniteData<Recommendation[]>>({ queryKey }, (data) =>
      prependRecommendationPage(data, rec),
    );
  }
}

export function prependMapPinToCaches(queryClient: QueryClient, pin: MapPinRow): void {
  queryClient.setQueriesData<MapPinRow[]>({ queryKey: REX_QUERY_KEYS.mapRexPins }, (data) => {
    if (!data) return [pin];
    if (data.some((row) => row.rex_id === pin.rex_id)) return data;
    return [pin, ...data];
  });
}
