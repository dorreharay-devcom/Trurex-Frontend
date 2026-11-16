import { useAuth } from '~/features/auth/providers';
import { useUserConfig } from '~/features/auth/hooks/useUserConfig';
import { ACCOUNT_KIND } from '~/features/business-account/config/accountKind';
import { parseBusinessClaimStatus } from '~/features/business-account/config/claimStatus';
import { resolveAccountKind } from '~/features/business-account/lib/accountKind';
import { canStartBusinessClaim } from '~/features/business-account/lib/claimEligibility';
import { TEMPORARY_ENABLE_BUSINESS_PROFILE_CLAIM } from '~/shared/config/featureFlags';

export function useBusinessAccount() {
  const { user } = useAuth();
  const { userConfig, isLoading, isReadOnly } = useUserConfig();

  const claimStatus = TEMPORARY_ENABLE_BUSINESS_PROFILE_CLAIM
    ? parseBusinessClaimStatus(userConfig?.business_claim_status)
    : null;
  const isBusinessAccount =
    TEMPORARY_ENABLE_BUSINESS_PROFILE_CLAIM && userConfig?.is_business_account === true;
  const kind = TEMPORARY_ENABLE_BUSINESS_PROFILE_CLAIM
    ? resolveAccountKind({ accountType: userConfig?.account_type, isBusinessAccount })
    : ACCOUNT_KIND.regular;

  return {
    userId: user?.id,
    kind,
    claimStatus,
    isBusinessAccount,
    isReadOnly,
    canStartClaim:
      TEMPORARY_ENABLE_BUSINESS_PROFILE_CLAIM && canStartBusinessClaim({ claimStatus, isReadOnly }),
    isLoading,
  };
}
