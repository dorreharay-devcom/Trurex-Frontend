import { useQuery } from '@tanstack/react-query';
import { DiscoveryApi, DiscoverFeedParams } from '~/api/DiscoveryApi';
import { recommendations as mockRecommendations } from '~/data/mockData';

export const useDiscoveryFeed = (params?: DiscoverFeedParams) => {
  return useQuery({
    queryKey: ['discovery-feed', params],
    queryFn: async () => {
      try {
        const data = await DiscoveryApi.getDiscoverFeed(params);
        if (!data || data.length === 0) {
          return mockRecommendations;
        }
        return data;
      } catch (error) {
        console.warn('Discovery API error, falling back to mock data:', error);
        return mockRecommendations;
      }
    },
  });
};
