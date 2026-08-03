import { useQuery } from '@tanstack/react-query';
import { TagsApi, type TagRow } from '~/pages/discover/api/tagsApi';

export const useTrendingTags = () => {
  return useQuery<TagRow[]>({
    queryKey: ['tags', 'trending'],
    queryFn: () => TagsApi.trendingNow(),
    staleTime: 5 * 60_000,
  });
};
