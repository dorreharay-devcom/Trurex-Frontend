import { describe, expect, it, vi } from 'vitest';
import { getErrorMessage, mapAuthError, AuthErrorCode } from '~/features/auth/lib/errors';
import { ApiTimeoutError } from '~/shared/api/fetchWithTimeout';

describe('getErrorMessage', () => {
  it('maps known auth codes', () => {
    expect(getErrorMessage({ code: AuthErrorCode.InvalidCredentials })).toMatch(
      /email or password/i,
    );
    expect(getErrorMessage({ code: AuthErrorCode.OverEmailSendRateLimit })).toMatch(/too many/i);
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
    expect(setErrors).toHaveBeenCalledWith({ fullName: expect.any(String) });
    mapAuthError({ message: 'network blip' }, setErrors);
    expect(setErrors).toHaveBeenCalledWith({ general: expect.any(String) });
  });
});
