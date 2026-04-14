import { useQuery } from '@tanstack/react-query';
import { DiscoveryApi, DiscoverQueryParams } from '~/api/DiscoveryApi';
import { recommendations as mockRecommendations } from '~/data/mockData';

export const useDiscoverRecommendations = (params?: DiscoverQueryParams) => {
  return useQuery({
    queryKey: ['discover-recommendations', params],
    queryFn: async () => {
      try {
        const data = await DiscoveryApi.getDiscoverRecommendations(params);
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
