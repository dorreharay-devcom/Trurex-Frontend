import { skipToken, useQuery } from '@tanstack/react-query';
import { BusinessAccountApi } from '~/features/business-account/api/businessAccountApi';
import { BUSINESS_ACCOUNT_QUERY_KEYS } from '~/features/business-account/config/queryKeys';
import { useBusinessAccount } from '~/features/business-account/hooks/useBusinessAccount';

export function useBusinessProfile() {
  const { userId, isBusinessAccount } = useBusinessAccount();

  return useQuery({
    queryKey: BUSINESS_ACCOUNT_QUERY_KEYS.profile(userId),
    queryFn: userId && isBusinessAccount ? BusinessAccountApi.getProfile : skipToken,
    staleTime: 60_000,
  });
}
