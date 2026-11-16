import { useCallback } from 'react';
import { skipToken, useQuery, useQueryClient } from '@tanstack/react-query';
import { ACCOUNT_MODE, type AccountMode } from '~/features/business-account/config/accountMode';
import { BUSINESS_ACCOUNT_QUERY_KEYS } from '~/features/business-account/config/queryKeys';
import { useBusinessAccount } from '~/features/business-account/hooks/useBusinessAccount';
import {
  canSwitchAccountMode,
  isPostingAsBusiness,
  resolveEffectiveAccountMode,
} from '~/features/business-account/lib/accountKind';
import {
  readStoredAccountMode,
  writeStoredAccountMode,
} from '~/features/business-account/lib/accountModeStorage';

export function useAccountMode() {
  const queryClient = useQueryClient();
  const { userId, kind, isLoading } = useBusinessAccount();

  const stored = useQuery({
    queryKey: BUSINESS_ACCOUNT_QUERY_KEYS.accountMode(userId),
    queryFn: userId ? () => readStoredAccountMode(userId) : skipToken,
    staleTime: Infinity,
    gcTime: Infinity,
    networkMode: 'always',
  });

  const canSwitch = canSwitchAccountMode(kind);
  const mode = resolveEffectiveAccountMode(kind, stored.data);

  const setMode = useCallback(
    (next: AccountMode) => {
      if (!userId || !canSwitch) return;
      queryClient.setQueryData(BUSINESS_ACCOUNT_QUERY_KEYS.accountMode(userId), next);
      void writeStoredAccountMode(userId, next);
    },
    [canSwitch, queryClient, userId],
  );

  return {
    kind,
    mode,
    canSwitch,
    isBusinessMode: mode === ACCOUNT_MODE.business,
    postedAsBusiness: isPostingAsBusiness(mode),
    isLoading,
    setMode,
  };
}
