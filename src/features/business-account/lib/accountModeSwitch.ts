import type { QueryClient } from '@tanstack/react-query';
import { BusinessAccountApi } from '~/features/business-account/api/businessAccountApi';
import { ACCOUNT_MODE, type AccountMode } from '~/features/business-account/config/accountMode';
import { BUSINESS_ACCOUNT_QUERY_KEYS } from '~/features/business-account/config/queryKeys';
import {
  canSwitchAccountMode,
  resolveAccountKind,
} from '~/features/business-account/lib/accountKind';
import { writeStoredAccountMode } from '~/features/business-account/lib/accountModeStorage';
import type { MyProfile } from '~/features/business-account/types/myProfile';
import { isActingAsBusiness, setActingAsBusiness } from '~/shared/api/actingProfile';
import { LOGIN_SCOPED_QUERY_ROOTS } from '~/shared/config/queryKeys';

export function resetProfileScopedQueries(queryClient: QueryClient): void {
  void queryClient.resetQueries({
    predicate: (query) => !LOGIN_SCOPED_QUERY_ROOTS.includes(String(query.queryKey[0])),
  });
}

export function switchAccountMode(
  queryClient: QueryClient,
  userId: string,
  mode: AccountMode,
): void {
  setActingAsBusiness(mode === ACCOUNT_MODE.business);
  queryClient.setQueryData(BUSINESS_ACCOUNT_QUERY_KEYS.accountMode(userId), mode);
  void writeStoredAccountMode(userId, mode);
  resetProfileScopedQueries(queryClient);
}

export function fetchFreshMyProfiles(
  queryClient: QueryClient,
  userId: string,
): Promise<MyProfile[]> {
  return queryClient.fetchQuery({
    queryKey: BUSINESS_ACCOUNT_QUERY_KEYS.myProfiles(userId),
    queryFn: BusinessAccountApi.getMyProfiles,
    staleTime: 0,
  });
}

export function ensureAccountMode(
  queryClient: QueryClient,
  userId: string,
  profiles: readonly MyProfile[],
  mode: AccountMode,
): void {
  if (!canSwitchAccountMode(resolveAccountKind(profiles))) return;
  if (isActingAsBusiness() === (mode === ACCOUNT_MODE.business)) return;
  switchAccountMode(queryClient, userId, mode);
}
