import type { InfiniteData, QueryClient } from '@tanstack/react-query';
import { REX_QUERY_KEYS } from '~/shared/config/queryKeys';
import {
  patchInfiniteRecommendations,
  patchRecommendationList,
  type RecListPatch,
} from '~/shared/lib/query/patchRecommendationList';
import type { Recommendation } from '~/shared/types/recommendation';

const INFINITE_KEYS = [
  REX_QUERY_KEYS.discoverFeed,
  REX_QUERY_KEYS.myRexes,
  REX_QUERY_KEYS.mySavedRexes,
] as const;

const LIST_KEYS = [REX_QUERY_KEYS.searchRexes, REX_QUERY_KEYS.mapRexesInBounds] as const;

export function patchRecommendationInCaches(
  queryClient: QueryClient,
  rexId: string,
  patch: RecListPatch,
): void {
  for (const queryKey of INFINITE_KEYS) {
    queryClient.setQueriesData<InfiniteData<Recommendation[]>>({ queryKey }, (data) =>
      patchInfiniteRecommendations(data, rexId, patch),
    );
  }
  for (const queryKey of LIST_KEYS) {
    queryClient.setQueriesData<Recommendation[]>({ queryKey }, (data) =>
      patchRecommendationList(data, rexId, patch),
    );
  }
}

export function patchFeedLike(
  queryClient: QueryClient,
  rexId: string,
  isLiked: boolean,
  likes: number,
): void {
  patchRecommendationInCaches(queryClient, rexId, { isLiked, likes });
}

export function patchFeedCommentCount(
  queryClient: QueryClient,
  rexId: string,
  commentCount: number,
): void {
  patchRecommendationInCaches(queryClient, rexId, { comments: commentCount });
}
