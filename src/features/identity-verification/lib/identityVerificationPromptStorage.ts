import { StorageService } from '~/shared/lib/storage/kv';

function storageKey(userId: string): string {
  return `trurex.identity_verification.prompted.${userId}`;
}

export async function readStoredIdentityVerificationPrompted(userId: string): Promise<boolean> {
  const value = await StorageService.getItem(storageKey(userId));
  return value === 'true';
}

export async function writeStoredIdentityVerificationPrompted(userId: string): Promise<void> {
  await StorageService.setItem(storageKey(userId), 'true');
}
