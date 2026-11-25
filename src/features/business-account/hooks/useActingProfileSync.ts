import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ACCOUNT_MODE } from '~/features/business-account/config/accountMode';
import { useAccountMode } from '~/features/business-account/hooks/useAccountMode';
import { sendsActingHeader } from '~/features/business-account/lib/accountKind';
import {
  resetProfileScopedQueries,
  switchAccountMode,
} from '~/features/business-account/lib/accountModeSwitch';
import { useAuth } from '~/features/auth/providers';
import { isActingAsBusiness, setActingAsBusiness } from '~/shared/api/actingProfile';
import { registerBusinessProfileMissingHandler } from '~/shared/lib/errors/restriction';
import { invalidateBusinessAccount } from '~/shared/lib/query/invalidateBusinessAccount';

export function useActingProfileSync() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { kind, mode, isLoading } = useAccountMode();
  const userId = user?.id;
  const sendsHeader = Boolean(userId) && sendsActingHeader(kind, mode);

  useEffect(() => {
    if (isLoading || isActingAsBusiness() === sendsHeader) return;
    setActingAsBusiness(sendsHeader);
    resetProfileScopedQueries(queryClient);
  }, [isLoading, queryClient, sendsHeader]);

  useEffect(
    () =>
      registerBusinessProfileMissingHandler(() => {
        if (!userId) return;
        switchAccountMode(queryClient, userId, ACCOUNT_MODE.personal);
        invalidateBusinessAccount(queryClient);
      }),
    [queryClient, userId],
  );
}
