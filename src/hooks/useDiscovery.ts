import { useQuery } from '@tanstack/react-query';
import { DiscoveryApi, DiscoverFeedParams } from '~/api/DiscoveryApi';

export const useDiscoveryFeed = (params?: DiscoverFeedParams) => {
  return useQuery({
    queryKey: ['discovery-feed', params],
    queryFn: () => DiscoveryApi.getDiscoverFeed(params),
  });
};
