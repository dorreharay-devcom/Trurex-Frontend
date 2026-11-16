import { describe, expect, it, vi } from 'vitest';
import type { Session, User } from '@supabase/supabase-js';
import {
  getErrorMessage,
  mapAuthError,
  isExistingAccountSignUp,
  AuthErrorCode,
  EMAIL_ALREADY_USED_MESSAGE,
} from '~/features/auth/lib/errors';
import { ApiTimeoutError } from '~/shared/api/fetchWithTimeout';

describe('getErrorMessage', () => {
  it('maps known auth codes', () => {
    expect(getErrorMessage({ code: AuthErrorCode.InvalidCredentials })).toMatch(
      /email or password/i,
    );
    expect(getErrorMessage({ code: AuthErrorCode.OverEmailSendRateLimit })).toMatch(/too many/i);
  });

  it('maps duplicate email codes to the already-used message', () => {
    expect(EMAIL_ALREADY_USED_MESSAGE).toBe('This email is already used.');
    expect(getErrorMessage({ code: AuthErrorCode.UserAlreadyExists })).toBe(
      EMAIL_ALREADY_USED_MESSAGE,
    );
    expect(getErrorMessage({ code: AuthErrorCode.EmailExists })).toBe(EMAIL_ALREADY_USED_MESSAGE);
    expect(getErrorMessage({ error: { code: 'email_exists' } })).toBe(EMAIL_ALREADY_USED_MESSAGE);
  });

  it('maps legacy invalid login message', () => {
    expect(getErrorMessage({ message: 'Invalid login credentials' })).toMatch(/email or password/i);
  });

  it('prefer network messages for timeout and 429', () => {
    expect(getErrorMessage(new ApiTimeoutError())).toMatch(/timed out/i);
    expect(getErrorMessage({ status: 429, message: 'slow' })).toMatch(/too many/i);
  });

  it('falls back for unknown errors', () => {
    expect(getErrorMessage(null)).toMatch(/unexpected/i);
    expect(getErrorMessage({ message: 'custom fail' })).toBe('custom fail');
    expect(getErrorMessage('string error')).toBe('string error');
  });
});

describe('mapAuthError', () => {
  it('routes errors to email, password, name, or general', () => {
    const setErrors = vi.fn();
    mapAuthError({ message: 'email already exists' }, setErrors);
    expect(setErrors).toHaveBeenCalledWith({ email: expect.any(String) });
    mapAuthError({ message: 'password too short' }, setErrors);
    expect(setErrors).toHaveBeenCalledWith({ password: expect.any(String) });
    mapAuthError({ message: 'name required' }, setErrors);
    expect(setErrors).toHaveBeenCalledWith({ displayName: expect.any(String) });
    mapAuthError({ message: 'network blip' }, setErrors);
    expect(setErrors).toHaveBeenCalledWith({ general: expect.any(String) });
  });

  it('routes duplicate email errors to the email field', () => {
    const setErrors = vi.fn();
    mapAuthError(
      { code: AuthErrorCode.UserAlreadyExists, message: 'User already registered' },
      setErrors,
    );
    expect(setErrors).toHaveBeenLastCalledWith({ email: EMAIL_ALREADY_USED_MESSAGE });
    mapAuthError({ code: AuthErrorCode.EmailExists }, setErrors);
    expect(setErrors).toHaveBeenLastCalledWith({ email: EMAIL_ALREADY_USED_MESSAGE });
  });
});

describe('isExistingAccountSignUp', () => {
  const user = (identities: User['identities']) => ({ id: 'u1', identities }) as User;
  const session = {} as Session;

  it('detects the identity-less user returned for an already registered email', () => {
    expect(isExistingAccountSignUp({ user: user([]), session: null })).toBe(true);
  });

  it('treats a fresh sign-up as a new account', () => {
    const identity = { id: 'i1' } as NonNullable<User['identities']>[number];
    expect(isExistingAccountSignUp({ user: user([identity]), session: null })).toBe(false);
    expect(isExistingAccountSignUp({ user: user([]), session })).toBe(false);
    expect(isExistingAccountSignUp({ user: user(undefined), session: null })).toBe(false);
    expect(isExistingAccountSignUp({ user: null, session: null })).toBe(false);
  });
});
