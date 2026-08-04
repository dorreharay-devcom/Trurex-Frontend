import type { InfiniteData, QueryClient } from '@tanstack/react-query';
import { REX_QUERY_KEYS } from '~/shared/config/queryKeys';
import type { Recommendation } from '~/shared/types/recommendation';

function patchRecommendationList(
  list: Recommendation[] | undefined,
  rexId: string,
  commentCount: number,
): Recommendation[] | undefined {
  if (!list?.length) return list;
  let changed = false;
  const next = list.map((rec) => {
    if (rec.id !== rexId || rec.comments === commentCount) return rec;
    changed = true;
    return { ...rec, comments: commentCount };
  });
  return changed ? next : list;
}

function patchInfiniteRecommendations(
  data: InfiniteData<Recommendation[]> | undefined,
  rexId: string,
  commentCount: number,
): InfiniteData<Recommendation[]> | undefined {
  if (!data?.pages.length) return data;
  let changed = false;
  const pages = data.pages.map((page) => {
    const next = patchRecommendationList(page, rexId, commentCount);
    if (next !== page) changed = true;
    return next ?? page;
  });
  return changed ? { ...data, pages } : data;
}

export function patchFeedCommentCount(
  queryClient: QueryClient,
  rexId: string,
  commentCount: number,
): void {
  const infiniteKeys = [
    REX_QUERY_KEYS.discoverFeed,
    REX_QUERY_KEYS.myRexes,
    REX_QUERY_KEYS.mySavedRexes,
  ] as const;

  for (const queryKey of infiniteKeys) {
    queryClient.setQueriesData<InfiniteData<Recommendation[]>>({ queryKey }, (data) =>
      patchInfiniteRecommendations(data, rexId, commentCount),
    );
  }

  const listKeys = [REX_QUERY_KEYS.searchRexes, REX_QUERY_KEYS.mapRexesInBounds] as const;
  for (const queryKey of listKeys) {
    queryClient.setQueriesData<Recommendation[]>({ queryKey }, (data) =>
      patchRecommendationList(data, rexId, commentCount),
    );
  }
}
