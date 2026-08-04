import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUserConfig } from '~/shared/api/userConfigApi';
import { useAuth } from '~/features/auth/providers';
import {
  isAccountSuspendedStatus,
  terminateSessionForSuspendedAccount,
} from '~/shared/lib/errors/restriction';

export function useUserConfig() {
  const { user } = useAuth();
  const userId = user?.id;

  const query = useQuery({
    queryKey: ['user_config', userId ?? 'no-session'],
    queryFn: fetchUserConfig,
    enabled: Boolean(userId),
  });

  const status = query.data?.status ?? null;
  const isAccountFrozen = status === 'frozen';
  const isAccountSuspended = isAccountSuspendedStatus(status);

  useEffect(() => {
    if (!userId || !isAccountSuspended) return;
    terminateSessionForSuspendedAccount();
  }, [isAccountSuspended, userId]);

  return {
    ...query,
    userConfig: query.data ?? null,
    status,
    isAccountFrozen,
    isAccountSuspended,
    isReadOnly: isAccountFrozen || isAccountSuspended,
  };
}
