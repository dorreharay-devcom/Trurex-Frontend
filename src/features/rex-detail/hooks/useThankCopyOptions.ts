import { useQuery } from '@tanstack/react-query';
import { getThankCopyOptions } from '~/features/rex-detail/api/thankRexApi';
import { REX_QUERY_KEYS } from '~/shared/config/queryKeys';

export function useThankCopyOptions(enabled: boolean) {
  return useQuery({
    queryKey: REX_QUERY_KEYS.thankCopyOptions,
    queryFn: getThankCopyOptions,
    enabled,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}
