import { useQuery } from '@tanstack/react-query';
import { TagsApi, type TagRow } from '~/api/TagsApi';

export const useTrendingTags = () => {
  return useQuery<TagRow[]>({
    queryKey: ['tags', 'trending'],
    queryFn: () => TagsApi.trendingNow(),
    staleTime: 5 * 60_000,
  });
};

export const useSearchTags = (searchTerm: string, limit = 20) => {
  return useQuery<TagRow[]>({
    queryKey: ['tags', 'search', searchTerm, limit],
    queryFn: () => TagsApi.search(searchTerm, limit),
    enabled: searchTerm.length > 0,
    staleTime: 30_000,
  });
};
