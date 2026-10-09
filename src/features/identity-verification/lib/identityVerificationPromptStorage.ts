import { StorageService } from '~/shared/lib/storage/kv';

export const IDENTITY_VERIFICATION_PROMPTED_STORAGE_KEY = 'trurex.identity_verification.prompted';

export async function readStoredIdentityVerificationPrompted(): Promise<boolean> {
  const value = await StorageService.getItem(IDENTITY_VERIFICATION_PROMPTED_STORAGE_KEY);
  return value === 'true';
}

export async function writeStoredIdentityVerificationPrompted(): Promise<void> {
  await StorageService.setItem(IDENTITY_VERIFICATION_PROMPTED_STORAGE_KEY, 'true');
}
