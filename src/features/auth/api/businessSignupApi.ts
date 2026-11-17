import { Backend } from '~/shared/api/client';
import { throwRpcIfFailed } from '~/shared/lib/errors/restriction';

export async function setBusinessAccount(displayName: string): Promise<void> {
  throwRpcIfFailed(
    await Backend.rpc('set_business_account', {
      p_display_name: displayName,
    }),
  );
}
