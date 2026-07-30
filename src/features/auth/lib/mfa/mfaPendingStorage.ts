import { StorageService } from '~/shared/lib/storage';

export const MFA_PENDING_STORAGE_KEY = 'trurex.mfa.pending';

export async function readStoredMfaPending(): Promise<boolean> {
  const value = await StorageService.getItem(MFA_PENDING_STORAGE_KEY);
  return value === 'true';
}

export async function writeStoredMfaPending(pending: boolean): Promise<void> {
  if (pending) {
    await StorageService.setItem(MFA_PENDING_STORAGE_KEY, 'true');
    return;
  }
  await StorageService.removeItem(MFA_PENDING_STORAGE_KEY);
}
