import { beforeEach, describe, expect, it, vi } from 'vitest';
import { resolvePostAuthRoute } from './postAuthRoute';
import { BUSINESS_SIGNUP_INTENT_STORAGE_KEY } from './businessSignupIntentStorage';

const storage = new Map<string, string>();
const identity = { prompt: false };
const flags = { businessProfileClaim: true };
const userConfig = { is_business_account: false as boolean | null };
const fetchUserConfig = vi.fn(async () => userConfig);

vi.mock('~/shared/config/featureFlags', () => ({
  get TEMPORARY_ENABLE_BUSINESS_PROFILE_CLAIM() {
    return flags.businessProfileClaim;
  },
}));

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

vi.mock('~/shared/api/userConfigApi', () => ({
  fetchUserConfig: () => fetchUserConfig(),
}));

vi.mock('~/features/identity-verification/lib/shouldPromptIdentityVerification', () => ({
  shouldPromptIdentityVerification: vi.fn(async () => identity.prompt),
}));

beforeEach(() => {
  storage.clear();
  identity.prompt = false;
  flags.businessProfileClaim = true;
  userConfig.is_business_account = false;
  fetchUserConfig.mockClear();
});

describe('resolvePostAuthRoute', () => {
  it('never completes business sign-up while the feature flag is off', async () => {
    storage.set(BUSINESS_SIGNUP_INTENT_STORAGE_KEY, 'true');
    flags.businessProfileClaim = false;

    expect(await resolvePostAuthRoute()).toBeNull();
    expect(fetchUserConfig).not.toHaveBeenCalled();
    expect(storage.has(BUSINESS_SIGNUP_INTENT_STORAGE_KEY)).toBe(false);
  });


  it('enters the app when nothing else is pending', async () => {
    expect(await resolvePostAuthRoute()).toBeNull();
    expect(fetchUserConfig).not.toHaveBeenCalled();
  });

  it('prompts identity verification without loading the user config when there is no intent', async () => {
    identity.prompt = true;

    expect(await resolvePostAuthRoute()).toBe('/verify-identity');
    expect(fetchUserConfig).not.toHaveBeenCalled();
  });

  it('asks a personal account to finish business sign-up and consumes the intent', async () => {
    storage.set(BUSINESS_SIGNUP_INTENT_STORAGE_KEY, 'true');
    identity.prompt = true;

    expect(await resolvePostAuthRoute()).toBe('/business-signup');
    expect(storage.has(BUSINESS_SIGNUP_INTENT_STORAGE_KEY)).toBe(false);
  });

  it('falls through when the account is already a business account', async () => {
    storage.set(BUSINESS_SIGNUP_INTENT_STORAGE_KEY, 'true');
    userConfig.is_business_account = true;

    expect(await resolvePostAuthRoute()).toBeNull();
    expect(fetchUserConfig).toHaveBeenCalledTimes(1);
    expect(storage.has(BUSINESS_SIGNUP_INTENT_STORAGE_KEY)).toBe(false);
  });

  it('falls through to identity verification for an existing business account', async () => {
    storage.set(BUSINESS_SIGNUP_INTENT_STORAGE_KEY, 'true');
    userConfig.is_business_account = true;
    identity.prompt = true;

    expect(await resolvePostAuthRoute()).toBe('/verify-identity');
  });

  it('asks to finish business sign-up when the user config cannot be loaded', async () => {
    storage.set(BUSINESS_SIGNUP_INTENT_STORAGE_KEY, 'true');
    fetchUserConfig.mockRejectedValueOnce(new Error('offline'));

    expect(await resolvePostAuthRoute()).toBe('/business-signup');
    expect(storage.has(BUSINESS_SIGNUP_INTENT_STORAGE_KEY)).toBe(false);
  });
});
