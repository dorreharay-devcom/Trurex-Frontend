import { Backend } from '~/shared/api/client';
import { throwRpcIfFailed } from '~/shared/lib/errors/restriction';
import { toUserConfigRow } from '~/shared/lib/userConfig';
import type { UserConfigRow } from '~/shared/types/userConfig';

export async function fetchUserConfig(): Promise<UserConfigRow> {
  const { data, error } = await Backend.rpc('user_config');
  throwRpcIfFailed({ data, error });
  return toUserConfigRow(data);
}
