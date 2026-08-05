import type { InfiniteData } from '@tanstack/react-query';
import type { Recommendation } from '~/shared/types/recommendation';

export type RecListPatch = Partial<
  Pick<Recommendation, 'isLiked' | 'likes' | 'comments' | 'isSaved'>
>;

export function patchRecommendationList(
  list: Recommendation[] | undefined,
  rexId: string,
  patch: RecListPatch,
): Recommendation[] | undefined {
  if (!list?.length) return list;

  const index = list.findIndex((rec) => rec.id === rexId);
  if (index < 0) return list;

  return list.map((rec, i) => (i === index ? { ...rec, ...patch } : rec));
}

export function patchInfiniteRecommendations(
  data: InfiniteData<Recommendation[]> | undefined,
  rexId: string,
  patch: RecListPatch,
): InfiniteData<Recommendation[]> | undefined {
  if (!data?.pages.length) return data;

  const pages = data.pages.map((page) => patchRecommendationList(page, rexId, patch) ?? page);
  const changed = pages.some((page, i) => page !== data.pages[i]);
  if (!changed) return data;

  return { ...data, pages };
}
