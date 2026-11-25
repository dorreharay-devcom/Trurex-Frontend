import { useAuth } from '~/features/auth/providers';
import { useUserConfig } from '~/features/auth/hooks/useUserConfig';
import { ACCOUNT_KIND } from '~/features/business-account/config/accountKind';
import { parseBusinessClaimStatus } from '~/features/business-account/config/claimStatus';
import { useMyProfiles } from '~/features/business-account/hooks/useMyProfiles';
import { resolveAccountKind } from '~/features/business-account/lib/accountKind';
import { canStartBusinessClaim } from '~/features/business-account/lib/claimEligibility';
import type { MyProfile } from '~/features/business-account/types/myProfile';
import { TEMPORARY_ENABLE_BUSINESS_PROFILE_CLAIM } from '~/shared/config/featureFlags';

const NO_PROFILES: readonly MyProfile[] = [];

export function useBusinessAccount() {
  const { user } = useAuth();
  const { userConfig, isLoading: configLoading, isReadOnly } = useUserConfig();
  const myProfiles = useMyProfiles();
  const profiles = myProfiles.data ?? NO_PROFILES;

  const claimStatus = TEMPORARY_ENABLE_BUSINESS_PROFILE_CLAIM
    ? parseBusinessClaimStatus(userConfig?.business_claim_status)
    : null;
  const kind = resolveAccountKind(profiles);

  return {
    userId: user?.id,
    kind,
    profiles,
    claimStatus,
    isBusinessAccount: kind !== ACCOUNT_KIND.regular,
    isReadOnly,
    canStartClaim:
      TEMPORARY_ENABLE_BUSINESS_PROFILE_CLAIM && canStartBusinessClaim({ claimStatus, isReadOnly }),
    isLoading: configLoading || myProfiles.isLoading,
  };
}
