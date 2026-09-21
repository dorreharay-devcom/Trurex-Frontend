import { StorageService } from '~/shared/lib/storage/kv';

const LAST_PUSH_TOKEN_KEY = 'push.lastRegisteredToken';

export async function rememberPushToken(token: string): Promise<void> {
  await StorageService.setItem(LAST_PUSH_TOKEN_KEY, token).catch(() => undefined);
}

export async function readRememberedPushToken(): Promise<string | null> {
  return StorageService.getItem(LAST_PUSH_TOKEN_KEY).catch(() => null);
}

export async function forgetPushToken(): Promise<void> {
  await StorageService.removeItem(LAST_PUSH_TOKEN_KEY).catch(() => undefined);
}
