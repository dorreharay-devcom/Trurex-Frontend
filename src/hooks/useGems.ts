import { useQuery } from '@tanstack/react-query';
import { GemsApi, SavedRexesParams } from '~/api/GemsApi';
import type { Recommendation } from '~/types/recommendation/recommendation';

export const useSavedRexes = (params: SavedRexesParams = {}) => {
  return useQuery<Recommendation[]>({
    queryKey: ['my-saved-rexes', params],
    queryFn: () => GemsApi.getSavedRexes(params),
  });
};
