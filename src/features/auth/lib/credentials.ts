const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getEmailValidationError(email: string): string | undefined {
  if (!EMAIL_REGEX.test(email)) return 'Enter a valid email address';
  return undefined;
}

export function getPasswordValidationError(password: string): string | undefined {
  if (password.length < 6) return 'Password must be at least 6 characters';
  return undefined;
}

export function getFullNameValidationError(fullName: string): string | undefined {
  if (!fullName.trim()) return 'Full name is required';
  return undefined;
}

export function getConfirmPasswordValidationError(
  password: string,
  confirmPassword: string,
): string | undefined {
  if (!confirmPassword) return 'Confirm your new password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return undefined;
}

export function isFieldErrorsEmpty(errors: Record<string, string | undefined>): boolean {
  return !Object.values(errors).some(Boolean);
}
