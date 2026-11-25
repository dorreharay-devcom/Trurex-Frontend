import { skipToken, useQuery } from '@tanstack/react-query';
import { useAuth } from '~/features/auth/providers';
import { BusinessAccountApi } from '~/features/business-account/api/businessAccountApi';
import { BUSINESS_ACCOUNT_QUERY_KEYS } from '~/features/business-account/config/queryKeys';

export function useMyProfiles() {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: BUSINESS_ACCOUNT_QUERY_KEYS.myProfiles(userId),
    queryFn: userId ? BusinessAccountApi.getMyProfiles : skipToken,
    staleTime: 60_000,
  });
}
