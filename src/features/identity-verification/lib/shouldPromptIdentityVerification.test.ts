import { beforeEach, describe, expect, it, vi } from 'vitest';
import { shouldPromptIdentityVerification } from './shouldPromptIdentityVerification';

const platform = { web: false };
const profile = { verified: false };
const storage = new Map<string, string>();
const getCurrentUser = vi.fn(async () => profile);

vi.mock('~/shared/lib/ui/platform', () => ({
  get isWeb() {
    return platform.web;
  },
}));

vi.mock('~/shared/api/client', () => ({
  Auth: { getUser: vi.fn(async () => ({ data: { user: { id: 'user-1' } } })) },
}));

vi.mock('~/features/profile/api/profileApi', () => ({
  ProfileApi: { getCurrentUser: () => getCurrentUser() },
}));

vi.mock('~/shared/lib/storage/kv', () => ({
  StorageService: {
    getItem: vi.fn(async (key: string) => storage.get(key) ?? null),
    setItem: vi.fn(async (key: string, value: string) => {
      storage.set(key, value);
    }),
  },
}));

beforeEach(() => {
  platform.web = false;
  profile.verified = false;
  storage.clear();
  getCurrentUser.mockClear();
});

describe('shouldPromptIdentityVerification', () => {
  it('never prompts on web, where identity verification is not available', async () => {
    platform.web = true;

    expect(await shouldPromptIdentityVerification()).toBe(false);
    expect(getCurrentUser).not.toHaveBeenCalled();
  });

  it('prompts an unverified user on mobile the first time', async () => {
    expect(await shouldPromptIdentityVerification()).toBe(true);
  });

  it('does not prompt on mobile again once the user has seen it', async () => {
    storage.set('trurex.identity_verification.prompted', 'true');

    expect(await shouldPromptIdentityVerification()).toBe(false);
  });

  it('does not prompt a user who is already verified', async () => {
    profile.verified = true;

    expect(await shouldPromptIdentityVerification()).toBe(false);
  });
});
