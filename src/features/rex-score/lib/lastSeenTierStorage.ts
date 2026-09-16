import { StorageService } from '~/shared/lib/storage/kv';

function storageKey(userId: string): string {
  return `trurex.rexTier.lastSeen.${userId}`;
}

export async function readLastSeenTierCode(userId: string): Promise<string | null> {
  return StorageService.getItem(storageKey(userId));
}

export async function writeLastSeenTierCode(userId: string, tierCode: string): Promise<void> {
  await StorageService.setItem(storageKey(userId), tierCode);
}
