import type { QueryClient } from '@tanstack/react-query';
import { BUSINESS_ACCOUNT_REFRESH_KEYS } from '~/shared/config/queryKeys';

export function invalidateBusinessAccount(queryClient: QueryClient): void {
  for (const queryKey of BUSINESS_ACCOUNT_REFRESH_KEYS) {
    void queryClient.invalidateQueries({ queryKey });
  }
}
