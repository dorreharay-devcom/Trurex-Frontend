import { parseAccountMode, type AccountMode } from '~/features/business-account/config/accountMode';
import { StorageService } from '~/shared/lib/storage/kv';

function storageKey(userId: string): string {
  return `trurex.account_mode.${userId}`;
}

export async function readStoredAccountMode(userId: string): Promise<AccountMode | null> {
  return parseAccountMode(await StorageService.getItem(storageKey(userId)));
}

export async function writeStoredAccountMode(userId: string, mode: AccountMode): Promise<void> {
  await StorageService.setItem(storageKey(userId), mode);
}
