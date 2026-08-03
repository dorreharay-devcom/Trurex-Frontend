import { LEGAL_TERMS_STORAGE_KEY, LEGAL_TERMS_VERSION } from '~/features/auth/config/legal';
import { StorageService } from '~/shared/lib/storage/kv';
export async function persistTermsAcceptance(): Promise<void> {
  await StorageService.setItem(
    LEGAL_TERMS_STORAGE_KEY,
    JSON.stringify({
      version: LEGAL_TERMS_VERSION,
      acceptedAt: new Date().toISOString(),
    }),
  );
}
