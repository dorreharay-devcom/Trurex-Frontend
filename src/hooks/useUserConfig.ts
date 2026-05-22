import { useQuery } from '@tanstack/react-query';
import { fetchUserConfig } from '~/api/usersApi';
import { useAuth } from '~/services/AuthContext';

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

  return {
    ...query,
    userConfig: query.data ?? null,
    status,
    isAccountFrozen,
    isReadOnly: isAccountFrozen,
  };
}
