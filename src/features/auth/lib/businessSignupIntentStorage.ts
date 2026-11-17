import { StorageService } from '~/shared/lib/storage/kv';

export const BUSINESS_SIGNUP_INTENT_STORAGE_KEY = 'trurex.auth.businessSignupIntent';

export async function writeStoredBusinessSignupIntent(intent: boolean): Promise<void> {
  if (intent) {
    await StorageService.setItem(BUSINESS_SIGNUP_INTENT_STORAGE_KEY, 'true');
    return;
  }
  await StorageService.removeItem(BUSINESS_SIGNUP_INTENT_STORAGE_KEY);
}

export async function consumeStoredBusinessSignupIntent(): Promise<boolean> {
  const value = await StorageService.getItem(BUSINESS_SIGNUP_INTENT_STORAGE_KEY);
  await StorageService.removeItem(BUSINESS_SIGNUP_INTENT_STORAGE_KEY);
  return value === 'true';
}
