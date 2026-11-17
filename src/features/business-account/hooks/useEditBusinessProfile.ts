import { useCallback } from 'react';
import { useAuth } from '~/features/auth/providers';
import { useBusinessAccount } from '~/features/business-account/hooks/useBusinessAccount';
import { useBusinessProfile } from '~/features/business-account/hooks/useBusinessProfile';
import {
  resolveBusinessDisplayName,
  resolveEditBusinessStatus,
} from '~/features/business-account/lib/businessPageState';
import { optStr } from '~/shared/lib/data/guards';

export function useEditBusinessProfile() {
  const { user } = useAuth();
  const { kind, claimStatus, isLoading } = useBusinessAccount();
  const profile = useBusinessProfile();

  const status = resolveEditBusinessStatus({
    accountLoading: isLoading,
    claimStatus,
    profilePending: profile.isPending,
    profileError: profile.isError,
  });

  const businessName = resolveBusinessDisplayName({
    businessName: profile.data?.businessName ?? profile.data?.placeName ?? null,
    kind,
    displayName: optStr(user?.user_metadata?.display_name),
  });

  const { refetch } = profile;
  const retry = useCallback(() => {
    void refetch();
  }, [refetch]);

  return {
    status,
    userId: user?.id ?? null,
    profile: profile.data ?? null,
    businessName,
    address: profile.data?.address ?? null,
    retry,
  };
}
