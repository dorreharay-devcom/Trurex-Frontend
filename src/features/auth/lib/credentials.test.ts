import { describe, expect, it } from 'vitest';
import {
  getConfirmPasswordValidationError,
  getEmailValidationError,
  getFullNameValidationError,
  getPasswordValidationError,
  isFieldErrorsEmpty,
} from '~/features/auth/lib/credentials';

describe('credentials validation', () => {
  it('validates email password name confirm', () => {
    expect(getEmailValidationError('bad')).toBeTruthy();
    expect(getEmailValidationError('a@b.co')).toBeUndefined();
    expect(getPasswordValidationError('123')).toBeTruthy();
    expect(getPasswordValidationError('123456')).toBeUndefined();
    expect(getFullNameValidationError('  ')).toBeTruthy();
    expect(getFullNameValidationError('Ann')).toBeUndefined();
    expect(getConfirmPasswordValidationError('a', '')).toBeTruthy();
    expect(getConfirmPasswordValidationError('a', 'b')).toBeTruthy();
    expect(getConfirmPasswordValidationError('a', 'a')).toBeUndefined();
  });

  it('checks empty field-error maps', () => {
    expect(isFieldErrorsEmpty({ a: undefined, b: undefined })).toBe(true);
    expect(isFieldErrorsEmpty({ a: 'x' })).toBe(false);
  });
});
