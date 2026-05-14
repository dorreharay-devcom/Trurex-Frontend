import { useCallback } from 'react';
import { notifyReadOnlyRestriction } from '~/utils/readOnlyRestriction';
import { useUserConfig } from '~/hooks/useUserConfig';

export function useReadOnlyAction() {
  const { isReadOnly, isAccountFrozen, ...rest } = useUserConfig();

  const blockIfReadOnly = useCallback(() => {
    if (!isReadOnly) return false;
    notifyReadOnlyRestriction();
    return true;
  }, [isReadOnly]);

  return { isReadOnly, isAccountFrozen, blockIfReadOnly, ...rest };
}
