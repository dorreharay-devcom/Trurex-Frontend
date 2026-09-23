import { useQuery } from '@tanstack/react-query';
import { useAuth } from '~/features/auth/providers';
import { fetchMyReferralInfo } from '~/features/referrals/api/referralsApi';
import { REFERRALS_QUERY_KEY } from '~/shared/config/queryKeys';

export function useReferralInfo() {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: REFERRALS_QUERY_KEY,
    queryFn: fetchMyReferralInfo,
    enabled: Boolean(userId),
    staleTime: 60_000,
  });

  return {
    referralCode: data?.referral_code ?? null,
    totalReferrals: data?.total_referrals ?? 0,
    rewardedReferrals: data?.rewarded_referrals ?? 0,
    referredUsers: data?.referred_users ?? [],
    isLoading: Boolean(userId) && isLoading,
    isError,
    refetch,
  };
}
