import type { InfiniteData, QueryClient } from '@tanstack/react-query';
import type { Recommendation } from '~/types/recommendation/recommendation';

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

/** Keep list/card comment counts in sync after add/delete without a full refetch. */
export function patchFeedCommentCount(
  queryClient: QueryClient,
  rexId: string,
  commentCount: number,
): void {
  const infiniteKeys = ['discover-recommendations', 'my-rexes', 'my-saved-rexes'] as const;

  for (const key of infiniteKeys) {
    queryClient.setQueriesData<InfiniteData<Recommendation[]>>(
      { queryKey: [key] },
      (data) => patchInfiniteRecommendations(data, rexId, commentCount),
    );
  }

  const listKeys = ['search-rexes', 'mapRexesInBounds'] as const;
  for (const key of listKeys) {
    queryClient.setQueriesData<Recommendation[]>({ queryKey: [key] }, (data) =>
      patchRecommendationList(data, rexId, commentCount),
    );
  }
}
