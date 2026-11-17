import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BUSINESS_SIGNUP_INTENT_STORAGE_KEY,
  consumeStoredBusinessSignupIntent,
  writeStoredBusinessSignupIntent,
} from '~/features/auth/lib/businessSignupIntentStorage';

const storage = new Map<string, string>();

vi.mock('~/shared/lib/storage/kv', () => ({
  StorageService: {
    getItem: vi.fn(async (key: string) => storage.get(key) ?? null),
    setItem: vi.fn(async (key: string, value: string) => {
      storage.set(key, value);
    }),
    removeItem: vi.fn(async (key: string) => {
      storage.delete(key);
    }),
  },
}));

beforeEach(() => {
  storage.clear();
});

describe('business sign-up intent storage', () => {
  it('stores the intent and consumes it once', async () => {
    await writeStoredBusinessSignupIntent(true);

    expect(storage.get(BUSINESS_SIGNUP_INTENT_STORAGE_KEY)).toBe('true');
    expect(await consumeStoredBusinessSignupIntent()).toBe(true);
    expect(storage.has(BUSINESS_SIGNUP_INTENT_STORAGE_KEY)).toBe(false);
    expect(await consumeStoredBusinessSignupIntent()).toBe(false);
  });

  it('clears the intent when written as false', async () => {
    await writeStoredBusinessSignupIntent(true);
    await writeStoredBusinessSignupIntent(false);

    expect(storage.has(BUSINESS_SIGNUP_INTENT_STORAGE_KEY)).toBe(false);
    expect(await consumeStoredBusinessSignupIntent()).toBe(false);
  });

  it('ignores unexpected stored values', async () => {
    storage.set(BUSINESS_SIGNUP_INTENT_STORAGE_KEY, 'yes');

    expect(await consumeStoredBusinessSignupIntent()).toBe(false);
    expect(storage.has(BUSINESS_SIGNUP_INTENT_STORAGE_KEY)).toBe(false);
  });
});
